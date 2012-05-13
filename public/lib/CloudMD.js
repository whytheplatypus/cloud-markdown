var get_blob_builder = function() {
	return BlobBuilder || WebKitBlobBuilder || MozBlobBuilder;
}

function utc() {
	var now = new Date();
	return now.getTime();
}

$(function(){

var dropbox_login = function(){
	var access_token = false
	if(localStorage.getItem("app_access_token")){
		access_token = JSON.parse(localStorage.getItem("app_access_token"));
	}
	$.post("db_connect", access_token?{"access_token": access_token}:{}, function(data){
		console.log(data);
		console.log(access_token);
		if(data.error && access_token){
			localStorage.removeItem("app_access_token");
			dropbox_login();
		}
		else if(data.request_token){
			var dropbox_link = document.getElementById("db_link");
			dropbox_link.href = data.request_token.authorize_url+"&oauth_callback="+data.callback;
			dropbox_link.style.display = "block";
		} 
		else if(data.access_token){
			localStorage.setItem("app_access_token", JSON.stringify(data.access_token));
		}
	});
}

//Set up our **marked** compiler
marked.setOptions({
	gfm: true,
	pedantic: false,
	sanitize: true,
	// callback for code highlighter
	highlight: function(code, lang) {
		if (lang === 'js') {
			return javascriptHighlighter(code);
		}
		return code;
	}
});

var Editor = function(){
	var self = this;
	//Set up our CodeMirror editor
	var delay;
	var foldFunc = CodeMirror.newFoldFunction(CodeMirror.braceRangeFinder);
	var editor = CodeMirror(document.getElementById("code"), {
		mode: "markdown",
		lineNumbers: true,
		value: "##New Markdown Document",
		onCursorActivity: function() {
			editor.matchHighlight("CodeMirror-matchhighlight");
			editor.setLineClass(hlLine, null, null);
			hlLine = editor.setLineClass(editor.getCursor().line, null, "activeline");
		},
		
		onChange:	function(){
			if(self.md){
				self.md.set("content", editor.getValue()); 
				self.md.set("utc", utc());
			}
			clearTimeout(delay);
			delay = setTimeout(updatePreview, 30);
		},
		
		lineWrapping: true,
		onGutterClick: foldFunc,
		smartIndent: false,
	});

	this.refresh = function(){
		editor.setValue(self.md.get("content"));
		editor.refresh();
	}
	
	this.getValue = function(){
		return editor.getValue();
	}
	
	this.setValue = function(string){
		editor.setValue(string);
	}
	
	var updatePreview = function(){
		if(self.md){
			document.getElementById("preview").innerHTML = marked(self.md.get("content"));
		} else {
			document.getElementById("preview").innerHTML = marked(editor.getValue());
		}
	}
	
	var hlLine = editor.setLineClass(0, "activeline");
	function selectTheme(node) {
		var theme = node.options[node.selectedIndex].innerHTML;
		editor.setOption("theme", theme);
	}
	
	var getSelectedRange = function() {
		return { from: editor.getCursor(true), to: editor.getCursor(false) };
	}
	
	var autoFormatSelection = function() {
		var range = getSelectedRange();
		editor.autoFormatRange(range.from, range.to);
	}
	
	var commentSelection = function(isComment) {
		var range = getSelectedRange();
		editor.commentRange(isComment, range.from, range.to);
	}
	
	window.onresize = syncSize;
	function syncSize(){
		var browserHeight = document.documentElement.clientHeight; 
		editor.getScrollerElement().style.height = (1 * browserHeight) + 'px' 
		editor.refresh();
	}
	syncSize();
}

var editor = new Editor();

var Document = Backbone.Model.extend({
	defaults: function(){
		return {
			name: "untitled",
			content: "##New Markdown Document",
			needs_sync: false,
			last_sync: 0
		}
	},
	
	initialize: function(){
		var self = this;
		if (!this.get("name")) {
    	this.set({"name": this.defaults.name});
    }
    if (!this.get("content")){
    	this.set({"content": this.defaults.content});
    }
    this.on("change:content", function(event){
    	//editor.md.autoSave();
    	//update editor
    	
    	self.save();
			clearTimeout(self.get("delay"));
			self.set("delay", setTimeout(function(){self.DBsync()}, 500));
    });
    if(this.get("needs_sync") && this.get("utc") == 0){
    	this.DBsync(); //could also listen for a needs_sync change
    }
	},
	
	DBsync: function(){
		var self = this;
		this.set("needs_sync", true);
		if(localStorage.getItem("app_access_token")){
			var access_token = JSON.parse(localStorage.getItem("app_access_token"));
			$.post("sync/file", {
					"access_token": access_token,
					"path": self.get('db_path'), 
					"file": {
						"name": self.get("name"),
						"utc": self.get("utc"),
						"last_sync": self.get("last_sync"),
						"content": self.get('content')
					}
				}, 
				function(data){
					if(data.success){
						self.set(data.model);
						self.set("last_sync", data.model.utc);
						console.log(data);
						console.log(self.get("name"));
						console.log(self.get("last_sync"));
						if(editor.md == self && data.model.content){
							editor.refresh();
						}
					}
					self.set("needs_sync", false);
				}
			);
		}
	},
	
	download: function(asHTML){
    if (asHTML) {
			//download the compiled HTML
			var
					BB = get_blob_builder()
				, bb = new BB;
			bb.append(marked(this.get("content")));
			saveAs(
					bb.getBlob("application/html;charset=" + document.characterSet)
				, (this.get("name")) + ".html"
			);
		}
		else {
			//download the md
			var BB = get_blob_builder();
			var bb = new BB;
			bb.append(this.get("content"));
			saveAs(
					bb.getBlob("text/x-markdown;charset=" + document.characterSet)
				, (this.get("name")) + ".md"
			);
		}
	},
	
	clear: function() {
		if(editor.md == this){
			editor.md = null;
			editor.setValue("##New Markdown Document");
			window.parent.document.title = "Cloud-MarkDown";
		}
		this.destroy();
	}
});

var DocumentList = Backbone.Collection.extend({
	model: Document,
	
	//localStorage: new Store("cloudmd"),
	
	files_to_sync: function(){
		var files = {};
		this.forEach(function(doc){
			files[doc.get("db_path")] = {"utc":doc.get("utc")};
		});
		return files;
	},
	DBsync: function(data){
		var self = this;
		if(data.files){
			for(var i in data.files){
				var document = self.find(function(doc){return doc.get("db_path") === data.files[i]})
				if(!document){
					var index = data.files[i].lastIndexOf("/");
					var index_dot = data.files[i].lastIndexOf(".");
					var name = data.files[i].substring(index+1, index_dot);
					self.create({name: name, utc: 0, db_path: data.files[i], needs_sync: true});
				} else {
					document.set("needs_sync", true);
					//document.set({content: data.files[i].content, utc: data.files[i].utc});
				}
			}
			self.forEach(function(doc){
				if(doc.get("needs_sync")){
					doc.DBsync();
				}
			});
		}
	},
});

var Folder = Backbone.Model.extend({
	defaults: function(){
		return{
			//docs: new DocumentList,
			path: "/",
			//subFolders: new FolderList
		}
	},
	
	initialize: function(){
		this.set("docs", new DocumentList);
		this.get("docs").url = this.get("path");
		this.get("docs").localStorage = new Store(this.get("path")+"_docs");
		this.set("subFolders", new FolderList);
		this.get("subFolders").url = this.get("path");
		this.get("subFolders").localStorage = new Store(this.get("path"));
		//this.get('subFolders').localStorage = this.localStorage || this.collection.localStorage;
		//this.get('docs').localStorage = this.localStorage || this.collection.localStorage;
		this.get("docs").fetch();
		this.get("subFolders").fetch();
	},
	
	DBsync: function(){
		var self = this;
		
		if(localStorage.getItem("app_access_token")){
			var access_token = JSON.parse(localStorage.getItem("app_access_token"));
			$.post("sync/dir", {"access_token": access_token, 
				"path": self.get("path"), 
				"files": self.get("docs").files_to_sync(), 
				"folders": self.get("subFolders").folders_to_sync()
			}, function(data){
				console.log("trying to sync");
				console.log(data);
				if(data.error){
					dropbox_login();
				}
				else{
					self.get("docs").DBsync(data);
					self.get("subFolders").DBsync(data);
				}
			});
		}
		else {
			dropbox_login();
		}
	}
});

var FolderList = Backbone.Collection.extend({
	model: Folder,

	
	folders_to_sync: function(){
		var folders = {};
		//could add utc later to avoid checking folders where no contents have been modified at all
		this.forEach(function(folder){
			folders[folder.get("path")] = true;
		});
		return folders;
	},
	
	DBsync: function(data){
		var self = this;
		//Now check for and create/delete folders, only creating for now
		if(data.folders){//folders as an array paths
			for(var i in data.folders){
				if(!self.any(function(folder){return folder.get("path") === data.folder[i]})){
					self.create({path: data.folders[i]});
				}
			}
		}
		self.forEach(function(folder){folder.DBsync();});
	}
});

//prevent duplicates
//answer from http://stackoverflow.com/questions/6416958/how-to-make-backbone-js-collection-items-unique
DocumentList.prototype.add = function(doc) {
    var isDupe = this.any(function(_doc) { 
        return _doc.get('name') == doc.get('name') || doc.get('name') == "app_access_token";
    });
    if (isDupe) {
        //Up to you either return false or throw an exception or silently ignore
        return false;
    }
    Backbone.Collection.prototype.add.call(this, doc);
}

FolderList.prototype.add = function(folder) {
    var isDupe = this.any(function(_folder) { 
        return _folder.get('path') == folder.get('path') || folder.get('path') == "app_access_token";
    });
    if (isDupe) {
        //Up to you either return false or throw an exception or silently ignore
        return false;
    }
    Backbone.Collection.prototype.add.call(this, folder);
}

//##Veiws

var DocumentView = Backbone.View.extend({
	tagName: "li",
	className: "document",
	template: _.template($('#document-template').html()),
	
	events: {
		"click .document-text"	: "show",
		"dblclick .view"  : "edit",
		"click a.document-destroy" : "clear",
		"click a.document-download" : "downloadMD",
		"click a.document-download-html" : "downloadHTML",
		"keypress .edit"  : "updateOnEnter",
		"blur .edit"      : "close"
	},
	
	initialize: function() {
		this.model.bind('change:name', this.render, this);
		this.model.bind('destroy', this.remove, this);
	},
	
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		this.input = this.$('.document-input');
		return this;
	},
	
	show: function() {
		this.model.DBsync();
		window.parent.document.title = this.model.get("name");
		app_router.navigate(this.model.get("db_path"));
		editor.md = this.model;
  		editor.refresh();
	},
	
	edit: function() {
		this.$el.addClass("editing");
		this.input.focus();
	},
	
	downloadMD: function(){
		this.model.download(false);
	},
	
	downloadHTML: function(){
		this.model.download(true);
	},
	
	close: function() {
		this.model.save({name: this.input.val()});
		this.$el.removeClass("editing");
	},
	
	updateOnEnter: function(e) {
		if (e.keyCode == 13) this.close();
	},
	
	clear: function() {
		this.model.clear();
	}
});

var DocumentListView = Backbone.View.extend({
	tagName: "div",
	className: "document-list",
	template: _.template($('#document-list-template').html()),
	// Delegated events for creating new items, and clearing completed ones.
	events: {
		"keypress .new-doc":  "createOnEnter",
		"keyup .new-doc":     "showTooltip"
	},

	// At initialization we bind to the relevant events on the `Todos`
	// collection, when items are added or changed. Kick things off by
	// loading any preexisting todos that might be saved in *localStorage*.
	initialize: function() {
		//this.Docs = new Root;
		this.model.bind('add',   this.addOne, this);
		this.model.bind('reset', this.addAll, this);
		//this.model.bind('all',   this.render, this);
		//this.model.fetch();
		//this.model.DBsync();
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		this.input = this.$(".new-doc");
		this.addAll();
		return this;
	},

	// Add a single doc item to the list by creating a view for it, and
	// appending its element to the `<ul>`.
	addOne: function(doc) {
		var view = new DocumentView({model: doc});
		this.$(".doc-list").append(view.render().el);
		if(doc.isNew() && !doc.get("db_path")){
			view.show();
		}
	},

	// Add all items in the **Docs** collection at once.
	addAll: function() {
		var self = this;
		//document.getElementById("doc-list").innerHTML = null;
		this.model.forEach(function(doc){self.addOne(doc)});
	},

	// If you hit return in the main input field, and there is text to save,
	// create new **Doc** model persisting it to *localStorage*.
	//Deal with creating a new folder later
	createOnEnter: function(e) {
		var text = this.input.val();
		if (!text || e.keyCode != 13) return;
		if(!editor.md){
			this.model.create({name: text, content: editor.getValue(), needs_sync: true, utc: 0});
		} else {
			this.model.create({name: text, needs_sync: true, utc: 0});
		}
		
		this.input.val();
	},

	// Lazily show the tooltip that tells you to press `enter` to save
	// a new todo item, after one second.
	showTooltip: function(e) {
		var tooltip = this.$(".ui-tooltip-top");
		var val = this.input.val();
		tooltip.fadeOut();
		if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
		if (val == '' || val == this.input.attr('placeholder')) return;
		var show = function(){ tooltip.show().fadeIn(); };
		this.tooltipTimeout = _.delay(show, 1000);
	}
});

var FolderListView = Backbone.View.extend({
	tagName: "ul",
	
	className: "folder-list",
	
	initialize: function() {
		//this.input = this.$("#new-doc");
		//this.Docs = new Root;
		console.log(this);
		var self = this;
		this.model.bind('add',   function(folder){self.addOne(folder)}, this);
		this.model.bind('reset', function(){self.addAll()}, this);
		//this.model.bind('all',   this.render, this);
		//this.model.fetch();
		//this.model.DBsync();
	},
	
	render: function(){
		//this.$el.html(this.template(this.model.toJSON()));
		console.log(this);
		this.addAll();
		return this;
	},
	
	// Add a single doc item to the list by creating a view for it, and
	// appending its element to the `<ul>`.
	addOne: function(folder) {
		console.log(this);
		var view = new FolderView({model: folder});
		this.$el.append(view.render().el);
	},

	// Add all items in the **Docs** collection at once.
	addAll: function() {
		console.log(this);
		var self = this;
		//document.getElementById("doc-list").innerHTML = null;
		this.model.forEach(function(folder){self.addOne(folder)});
	},
	
});

var FolderView = Backbone.View.extend({
	tagName: "li",
	className: "folder",
	template: _.template($('#folder-template').html()),

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		var view = new DocumentListView({model: this.model.get("docs")});
		this.$el.append(view.render().el);
		var folderListView = new FolderListView({model: this.model.get("subFolders")});
		this.$el.append(folderListView.render().el);
		return this;
	},
});
// The Application
// ---------------
// Our overall **AppView** is the top-level piece of UI.
var AppView = Backbone.View.extend({

	// Instead of generating a new element, bind to the existing skeleton of
	// the App already present in the HTML.
	el: $("#mdapp"),

	// At initialization we bind to the relevant events on the `Todos`
	// collection, when items are added or changed. Kick things off by
	// loading any preexisting todos that might be saved in *localStorage*.
	initialize: function() {
		//this.input = this.$("#new-doc");
		this.Root = new Folder({path: "/"});
		this.Root.DBsync();
		var self = this;
		//clearTimeout(self.delay);
		//self.delay = setTimeout(function(){self.Root.DBsync()}, 30000);
		this.render();
	},

	render: function() {
		var RootView = new FolderView({model: this.Root});
		this.$("#app-list").append(RootView.render().el);
	},
});

var App = new AppView;

var AppRouter = Backbone.Router.extend({
		routes: {
				"*path": "getFile", // matches http://example.com/#anything-here
				//"*actions": "defaultRoute"
		},
		defaultRoute: function(action){
			console.log(action);
		},
		getFile: function(path){
			path = "/"+path;
			console.log(path);
			var searchFolder = function(folder){
				var foundDoc = folder.get("docs").find(function(doc){
					return doc.get("db_path") === path;
				});
				if(!foundDoc){
					return folder.get("subFolders").forEach(function(folder){
						foundDoc = searchFolder(folder);
						if(foundDoc){
							return;
						}
					});
				} 
				if(foundDoc) {
					console.log(foundDoc);
					return foundDoc;
				} else {
					return false
				}
			};
		
			var foundDoc = App.Root.get("docs").find(function(doc){
				return doc.get("db_path") === path;
			});
			if(!foundDoc){
				App.Root.get("subFolders").forEach(function(folder){
					foundDoc = searchFolder(folder);
					if(foundDoc){
						return;
					}
				});
				
			}
			if(foundDoc){
				window.parent.document.title = foundDoc.get("name");
				editor.md = foundDoc;
  			editor.refresh();
			}
		}
});

// Instantiate the router
var app_router = new AppRouter;
// Start Backbone history a neccesary step for bookmarkable URL's
Backbone.history.start();


});