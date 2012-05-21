var get_blob_builder = function() {
	return BlobBuilder || WebKitBlobBuilder || MozBlobBuilder;
}

function utc() {
	var now = new Date();
	return now.getTime();
}

var expand = '<svg style="overflow-x: hidden; overflow-y: hidden; " height="40" version="1.1" width="40" xmlns="http://www.w3.org/2000/svg"><desc style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); ">Created with Raphaël 2.1.0</desc><defs style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); "><linearGradient style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); " id="8290-_0050af-_002c62" x1="0" y1="1" x2="6.123233995736766e-17" y2="0" gradientTransform="matrix(1,0,0,1,-4,-4)"><stop style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); " offset="0%" stop-color="#0050af"></stop><stop style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); " offset="100%" stop-color="#002c62"></stop></linearGradient></defs><path style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); stroke-linejoin: round; opacity: 0; " fill="none" stroke="#ffffff" d="M25.545,23.328L17.918,15.623L25.534,8.007L27.391,9.864L29.649,1.436L21.222,3.694L23.058,5.53L15.455,13.134L7.942,5.543L9.809,3.696L1.393,1.394L3.608,9.833L5.456,8.005L12.98,15.608L5.465,23.123L3.609,21.268L1.351,29.695L9.779,27.438L7.941,25.6L15.443,18.098L23.057,25.791L21.19,27.638L29.606,29.939L27.393,21.5Z" stroke-width="3" stroke-linejoin="round" opacity="0" transform="matrix(1,0,0,1,4,4)"></path><path style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); opacity: 1; fill-opacity: 1; " fill="url(#8290-_0050af-_002c62)" stroke="none" d="M25.545,23.328L17.918,15.623L25.534,8.007L27.391,9.864L29.649,1.436L21.222,3.694L23.058,5.53L15.455,13.134L7.942,5.543L9.809,3.696L1.393,1.394L3.608,9.833L5.456,8.005L12.98,15.608L5.465,23.123L3.609,21.268L1.351,29.695L9.779,27.438L7.941,25.6L15.443,18.098L23.057,25.791L21.19,27.638L29.606,29.939L27.393,21.5Z" transform="matrix(1,0,0,1,4,4)" opacity="1" fill-opacity="1"></path><rect style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); opacity: 0; " x="0" y="0" width="32" height="32" r="0" rx="0" ry="0" fill="#000000" stroke="#000" opacity="0"></rect></svg>';

var collapse = '<svg style="overflow-x: hidden; overflow-y: hidden; " height="40" version="1.1" width="40" xmlns="http://www.w3.org/2000/svg"><desc style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); ">Created with Raphaël 2.1.0</desc><defs style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); "></defs><path style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); stroke-linejoin: round; opacity: 0; " fill="none" stroke="#ffffff" d="M25.083,18.895L16.654999999999998,16.636L18.912999999999997,25.064L20.750999999999998,23.227L27.804,30.28L30.279999999999998,27.804000000000002L23.226999999999997,20.751L25.083,18.895ZM5.542,11.731L13.97,13.989L11.712,5.561L9.874,7.398L3.196,0.72L0.72,3.196L7.398,9.874L5.542,11.731ZM7.589,20.935L0.7190000000000003,27.804L3.1950000000000003,30.279999999999998L10.064,23.410999999999998L11.922,25.267999999999997L14.18,16.839999999999996L5.751999999999999,19.097999999999995L7.589,20.935ZM23.412,10.064L30.279,3.194L27.803,0.718L20.935000000000002,7.587L19.079,5.731L16.821,14.159L25.249000000000002,11.9L23.412,10.064Z" stroke-width="3" stroke-linejoin="round" opacity="0" transform="matrix(1,0,0,1,4,4)"></path><path style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); " fill="#333333" stroke="none" d="M25.083,18.895L16.654999999999998,16.636L18.912999999999997,25.064L20.750999999999998,23.227L27.804,30.28L30.279999999999998,27.804000000000002L23.226999999999997,20.751L25.083,18.895ZM5.542,11.731L13.97,13.989L11.712,5.561L9.874,7.398L3.196,0.72L0.72,3.196L7.398,9.874L5.542,11.731ZM7.589,20.935L0.7190000000000003,27.804L3.1950000000000003,30.279999999999998L10.064,23.410999999999998L11.922,25.267999999999997L14.18,16.839999999999996L5.751999999999999,19.097999999999995L7.589,20.935ZM23.412,10.064L30.279,3.194L27.803,0.718L20.935000000000002,7.587L19.079,5.731L16.821,14.159L25.249000000000002,11.9L23.412,10.064Z" transform="matrix(1,0,0,1,4,4)"></path><rect style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); opacity: 0; " x="0" y="0" width="32" height="32" r="0" rx="0" ry="0" fill="#000000" stroke="#000" opacity="0"></rect></svg>';


$(function(){

var dropbox_login = function(callback){
	var access_token = false
	if(localStorage.getItem("app_access_token")){
		access_token = JSON.parse(localStorage.getItem("app_access_token"));
	}
	$.post("db_connect", access_token?{"access_token": access_token}:{}, function(data){
		if(data.error && access_token){
			localStorage.removeItem("app_access_token");
			dropbox_login(callback);
		}
		else if(data.request_token){
			var dropbox_link = document.getElementById("db_link");
			dropbox_link.href = data.request_token.authorize_url+"&oauth_callback="+data.callback;
			dropbox_link.style.display = "block";
		} 
		else if(data.access_token){
			localStorage.setItem("app_access_token", JSON.stringify(data.access_token));
			callback();
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
	
	//add the expand button:
	var expandButton = document.createElement('div');
	expandButton.className = "expand";
	expandButton.innerHTML = expand;
	document.getElementById('code').appendChild(expandButton);

	

	this.refresh = function(){
		var cursorPos = editor.getCursor();
		editor.setValue(self.md.get("content"));
		editor.refresh();
		editor.setCursor(cursorPos);
		
		documentListScroll.refresh();
		editorScroll.refresh();
		previewScroll.refresh();
	}
	
	this.getValue = function(){
		return editor.getValue();
	}
	
	this.setValue = function(string){
		editor.setValue(string);
	}
	
	var updatePreview = function(){
		if(self.md){
			$("#preview .preview_content").html(marked(self.md.get("content")));
		} else {
			$("#preview .preview_content").html(marked(editor.getValue()));
		}
		previewScroll.refresh();
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
	$("#code .expand").click(function(){
		$('#code').toggleClass("full_screen");
		$('#preview').toggleClass("closed");
		if(this.getAttribute('data-fs') == "true"){
			this.setAttribute('data-fs', "false");
			this.innerHTML = expand;
		}
		else {
			console.log("testes");
			this.setAttribute('data-fs', "true");
			this.innerHTML = collapse;
		}
	});
	$("#preview .expand").click(function(){
		$('#preview').toggleClass("full_screen");
		$('#code').toggleClass("closed");
		if(this.getAttribute('data-fs') == "true"){
			this.setAttribute('data-fs', "false");
			this.innerHTML = expand;
		}
		else {
			this.setAttribute('data-fs', "true");
			this.innerHTML = collapse;
		}
	});
	
	this.getScrollerElement = function(){
		return editor.getScrollerElement();
	}
	
	var syncSize = function(){
		var browserHeight = document.documentElement.clientHeight; 
		var browserWidth = document.documentElement.clientWidth; 
		editor.getScrollerElement().style.minHeight = (1 * browserHeight) + 'px' ;
		document.getElementById("code").style.width = (1/2 * browserWidth)+'px';
		document.getElementById("preview").style.width = (1/2 * browserWidth)+'px';
		document.getElementById("preview").style.height = browserHeight + 'px';
		document.getElementById("docs").style.height = (browserHeight - 140) + 'px';
		
		editor.refresh();
	}
	window.addEventListener('resize',  syncSize, false);
	syncSize();
}

var editor = new Editor();

var Document = Backbone.Model.extend({
	defaults: function(){
		return {
			name: "untitled",
			content: "##New Markdown Document",
			needs_sync: false,
			syncing: false,
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
			if(!this.get('syncing')){
				console.log("start sync");
				var access_token = JSON.parse(localStorage.getItem("app_access_token"));
				this.set('syncing', true);
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
							if(editor.md == self && data.model.content){
								console.log("Should we reload the content?")
								//console.log("somethings up");
								console.log(data);
								console.log(self);
								//editor.refresh();
								
								smoke.confirm('This file has been changed on the dropbox side.',function(e){
									if (e){
										//smoke.alert('OK pressed');
										self.set(data.model);
									}else{
										//smoke.alert('CANCEL pressed');
										self.set({last_sync: data.model.last_sync, utc: utc()});
									}
								}, {ok:"Reload from dropbox", cancel:"Keep local version"});
								
							} else {
								self.set(data.model);
							}
							self.set("needs_sync", false);
							console.log("end sync")
							
						}
						else if(data.error){
							self.trigger('error');
						}
						self.set('syncing', false);
					}
				);
			}
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
		var self = this;
		if(editor.md == this){
			editor.md = null;
			editor.setValue("##New Markdown Document");
			window.parent.document.title = "Cloud-MarkDown";
		}
		if(localStorage.getItem("app_access_token")){
			var access_token = JSON.parse(localStorage.getItem("app_access_token"));
			$.post("rm/file", {
					"access_token": access_token,
					"path": self.get('db_path'), 
				}, 
				function(data){
					console.log(data);
					if(data.error){
						console.log(data);
					}
				}
			);
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
			files[doc.get("db_path")] = {"utc":doc.get("utc"), "last_sync":doc.get('last_sync')};
		});
		return files;
	},
	DBsync: function(data){
		var self = this;
		if(data.files){
			console.log(data.files);
			for(var i in data.files){
				var document = self.find(function(doc){return doc.get("db_path") === data.files[i].path})
				if(!document && !data.files[i].is_deleted){
					var index = data.files[i].path.lastIndexOf("/");
					var index_dot = data.files[i].path.lastIndexOf(".");
					var name = data.files[i].path.substring(index+1, index_dot);
					self.create({name: name, utc: 0, db_path: data.files[i].path, needs_sync: true});
				} 
				else if(document && data.files[i].is_deleted){
					document.clear();
				}
				else if(document){
					document.set("needs_sync", true);
					//document.set({content: data.files[i].content, utc: data.files[i].utc});
				}
			}
			self.forEach(function(doc){
				if(doc.get("needs_sync")){
					doc.DBsync();
				} else {
					doc.set("needs_sync", false);
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
				console.log(data);
				if(data.error){
					dropbox_login(function(){self.DBsync();});
				}
				else{
					self.get("docs").DBsync(data);
					self.get("subFolders").DBsync(data);
				}
			});
		}
		else {
			dropbox_login(function(){self.DBsync();});
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
				var directory = self.find(function(folder){return folder.get("path") === data.folders[i].path})
				if(!directory && !data.folders[i].is_deleted){
					self.create({path: data.folders[i].path});
				} else if(directory && data.folders[i].is_deleted){
					directory.destroy();
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

		this.model.on('change:syncing', this.updateSync, this);
		this.model.on('error', this.syncError, this);
		
	},
	
	syncError: function(){
		this.$(".failed_sync").css('display', 'block');
		this.$(".sync").css('display', 'none');
		this.$(".check").css('display', 'none');
	},
	
	updateSync: function(model, value, options){
		this.$(".failed_sync").css('display', 'none');
		//console.log(value);
		if(value){
			this.$(".sync").css('display', 'block');
			this.$(".check").css('display', 'none');
		} else {
			console.log("check");
			this.$(".sync").css('display', 'none');
			this.$(".check").css('display', 'block');
		}
	},
	
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		this.input = this.$('.document-input');
		this.updateSync(this.model, this.model.get("needs_sync"));
		var self = this;
		this.$(".document-text").hammer({prevent_default:true}).bind('tap', function(event) {
				self.show();
			}
		);
		this.$(".document-text").hammer({prevent_default:true}).bind('doubletap', function(event) {
				self.edit();
			}
		);
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
		
		this.input.val('');
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
		var self = this;
		this.model.bind('add',   function(folder){self.addOne(folder)}, this);
		this.model.bind('reset', function(){self.addAll()}, this);
		//this.model.bind('all',   this.render, this);
		//this.model.fetch();
		//this.model.DBsync();
	},
	
	render: function(){
		//this.$el.html(this.template(this.model.toJSON()));
		this.addAll();
		return this;
	},
	
	// Add a single doc item to the list by creating a view for it, and
	// appending its element to the `<ul>`.
	addOne: function(folder) {
		var view = new FolderView({model: folder});
		this.$el.append(view.render().el);
	},

	// Add all items in the **Docs** collection at once.
	addAll: function() {
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
		//this.Root.DBsync();
		var self = this;
		var rootSync = function(){
			clearTimeout(self.delay);
			self.Root.DBsync();
			self.delay = setTimeout(rootSync, 30000);
		}
		rootSync();
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

var documentListScroll = new iScroll('docs', {hScrollbar: false, vScrollbar: false });
var editorScroll = new iScroll('code', {hScrollbar: false, vScrollbar: false });
console.log(editorScroll);
var previewScroll = new iScroll('preview', {hScrollbar: false, vScrollbar: false });

// Instantiate the router
var app_router = new AppRouter;
// Start Backbone history a neccesary step for bookmarkable URL's
Backbone.history.start();

//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
/*
var pullout = function(event){
	console.log((-510 + event.distanceX));
	console.log(document.getElementById('mdapp').style.left);
	document.getElementById('mdapp').style.left = (-510 + event.distanceX)  + 'px';
};

var endPullout = function(event){
	if(event.distanceX > 260){
		$("#mdapp").css('left', '0px');
	} else {
		$("#mdapp").css('left', '-510px');
	}
};

//$("#mdapp").hammer({prevent_default:true}).bind("dragstart", startPullout);
$("#mdapp").hammer({prevent_default:true}).bind("drag", pullout);
$("#mdapp").hammer({prevent_default:true}).bind("dragend", endPullout);
*/
document.getElementById('mdapp').addEventListener('click', function(event){
	if(event.srcElement.id == 'mdapp'){
		$('#mdapp').toggleClass('pulled_out');
	}
}, false);

window.addEventListener("offline", function(e) {
  smoke.alert("You are working offline, so Syncing will have to wait.");
}, false);

window.addEventListener("online", function(e) {
  smoke.alert("Round of applause, Syncing's back!");
  App.Root.DBsync();
}, false);
	
});
