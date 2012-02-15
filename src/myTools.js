/**
 * Loader for My Tools
 * @source: based on [[w:no:User:Jeblad/vector.js]] (oldid=10096547)
 * @author: [[w:no:User:Jeblad]]
 * @author: [[User:Helder.wiki]]
 */

if ( typeof window.myTools === 'undefined' ) {
	window.myTools = {
		list: []
	};
}

myTools.now = new Date();
myTools.debug = /^(on|true|debug|1)$/.test( mw.util.getParamValue('debug') );
myTools.load = function(){
	var	home = '//pt.wikibooks.org/w/index.php?title=',
		params = '&action=raw' + (myTools.debug ? '&now=' + myTools.now.getTime() : '&smaxage=21600&maxage=86400'),
		reIsExternal = /^(https?:)?\/\//,
		curCSS, curJS, link, x;
	var loadResources = function(){
		var page;
		// FIXME: Fails on links such as https://toolserver.org/~magnus/wysiwtf/wysiwtf.js
		// Consider using wikilink2URL() from [[w:en:User:PerfektesChaos/js/Utilities/d.js]]
		if( curCSS ) {
			page = reIsExternal.test( curCSS ) ? curCSS: home + curCSS;
			mw.loader.load( page + '&ctype=text/css' + params, 'text/css' );
		}
		if( curJS ) {
			page = reIsExternal.test( curJS ) ? curJS: home + curJS;
			mw.loader.load( page + '&ctype=text/javascript' + params );
		}
	};
	var preventDefaultThenLoad = function (e) {
		e.preventDefault();
		loadResources();
	};
	// console.time("timeName");

	// Create a new portlet for my scripts
	$('#p-cactions').clone().insertBefore('#p-cactions').attr({
		'id': 'p-js',
		'class': 'vectorMenu emptyPortlet'
	}).find('li').remove().end().find('span').text('JS');

	// Run (or create a link for) each script
	for (x = 0; x< myTools.list.length; x++) {
		link = myTools.list[x];
		curCSS = link.style;
		curJS = link.script;
		if ( ( $.isFunction(link.autorun) && link.autorun() ) || link.autorun === true ) {
			// console.log("autorun " + link.title);
			loadResources();
		} else if ( ( $.isFunction(link.register) && link.register() ) || link.register === true   ) {
			// console.log("register " + link.title);
			$(mw.util.addPortletLink(
				(link.portlet || 'p-js'), '#', link.title, link.id, link.desc, link.shortcut, link.before
			)).click( preventDefaultThenLoad );
		}
	}
	// console.timeEnd("timeName");
};

console.log('MyTools: &now=' + myTools.now.getTime() + '; debug=' + myTools.debug );
$( myTools.load );