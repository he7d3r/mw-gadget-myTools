/**
 * Loader for My Tools
 * @source: based on [[w:no:User:Jeblad/vector.js]] (oldid=10096547)
 * @author: [[w:no:User:Jeblad]]
 * @author: [[User:Helder.wiki]]
 * @tracking: [[Special:GlobalUsage/User:Helder.wiki/Tools/myTools.js]] ([[File:User:Helder.wiki/Tools/myTools.js]])
 */
/*jslint browser: true, white: true*/
/*global jQuery, mediaWiki */
( function ( mw, $ ) {
'use strict';

var myTools = {
	list: [],
	now: new Date(),
	load: function(){
		var i, link,
			home = '//pt.wikibooks.org/w/index.php?title=',
			params = '&action=raw' + ( mw.config.get( 'debug' )
				? '&now=' + myTools.now.getTime()
				: '' ),
			reIsExternal = /^(https?:)?\/\//,
			loadResource = function( resource ){
				var page,
					css = resource.css,
					js = resource.js;
				// FIXME: Fails on links such as https://toolserver.org/~magnus/wysiwtf/wysiwtf.js
				// Consider using wikilink2URL() from [[w:en:User:PerfektesChaos/js/Utilities/d.js]]
				if( css ) {
					page = reIsExternal.test( css ) ? css: home + css;
					mw.loader.load( page + '&ctype=text/css' + params, 'text/css' );
				}
				if( js ) {
					page = reIsExternal.test( js ) ? js: home + js;
					mw.loader.load( page + '&ctype=text/javascript' + params );
				}
			},
			getOnClick = function ( resource ) {
				return function( e ){
					e.preventDefault();
					loadResource( resource );
				};
			};
		// console.time("timeName");

		// Create a new portlet for my scripts
		$('#p-cactions').clone()
			.attr({
				'id': 'p-js',
				'class': 'vectorMenu emptyPortlet'
			}).insertBefore('#p-views')
			.find('li').remove().end()
			.find('span').text('JS').end()
			.find('h5 a').css('background-position', 'bottom left');

		// Run (or create a link for) each script
		for( i = 0; i < myTools.list.length; i += 1 ){
			link = myTools.list[i];
			if ( ( $.isFunction(link.autorun) && link.autorun() ) || link.autorun === true ) {
				// mw.log("autorun " + link.title);
				loadResource( { js: link.script, css: link.style } );
			} else if ( ( $.isFunction(link.register) && link.register() ) || link.register === true   ) {
				// mw.log("register " + link.title);
				$(mw.util.addPortletLink(
					(link.portlet || 'p-js'), '#', link.title, link.id, link.desc, link.shortcut, link.before
				))
				.click( getOnClick( { js: link.script, css: link.style } ) );
			}
		}
		// console.timeEnd("timeName");
	}
};

window.myTools = $.extend( myTools, window.myTools );
// $.extend( window.myTools, $.extend( myTools, window.myTools ) );

mw.log('MyTools: &now=' + myTools.now.getTime() + '; debug=' + mw.config.get( 'debug' ) );
$( myTools.load );

}( mediaWiki, jQuery ) );