//first strip all classes etc, note that this only works with tables in the page
//this code goes through all <td>s and adds a unique name to each one based on its contents
$('tr').add('td').each(function(i,el){$(el).removeClass(); $(el).removeAttr('class');});
$('tr').each(function(i,el){
	x=$(el).find('a').eq(0).text();
	x=x.replace(/[-\ \'\"\.,:\/]/g, '%');
	if(x.substring(0, 1) == '%') {x = x.substring(1);}
	if(x==''){x='entry'+i;}
	console.log(x);
	$(el).addClass(x)
	});
$('tr').each(function(i,el){$(el).find('td').each(function(j,l){$(l).addClass('content.' + $(el).attr('class')+'%'+j)});});

//go through each row and spit out the correct yaml to the console and two textareas
//build textareas
$('textarea').remove();
var $t = $('<textarea style="width: 400px; height: 200px;">').insertBefore($('#main'));
var $u = $('<textarea style="width: 400px; height: 200px;">').insertBefore($('#main'));
var $f = $('<textarea style="width: 400px; height: 200px;">').insertBefore($('#main'));

//remove newlines within HTML
var h = $(document).html()

//turn elements into valid restructured text-formatted text nodes in document
$('a[name]').remove();
$('a img').each(function(i,el){$elparent=$(el).parent();$(el).insertBefore($elparent);$elparent.remove();});
$('a').each(function(i,el){t='`' + $(el).text() + '<' + $(el).attr('href') + '>`_'; $(el).replaceWith(document.createTextNode(t));});
$('img').each(function(i,el){t='.. image:: ' + $(el).attr('src'); $(el).replaceWith(document.createTextNode(t));});

//build the rows table
$('tr').each(function(i,el){x='  - '+i+': [ '+$(el).children().eq(0).attr('class')+', '+$(el).children().eq(1).attr('class')+' ]';console.log(x);$t.val($t.val() + '\n' + x);});

//build the content table
$('td').each(function(i,el){c=$(el).attr('class').replace('content.','') + ': ' + $(el).html().replace(/[ ]{2,}/g,' ').replace(/[\n]/g,'').replace(/[\"]/g,'\'');console.log(c);$u.val($u.val() + '\n' + c);});

//add yaml headers and complete
var layoutheaders ='\n---\n# table content, as content.<key>\nsection: content\n';
var contentheaders = '\n---\nsection: meta\n---\n# table structure. all content symbolic.\nsection: layout\nheader:\n  - 0: [ content.entry0%0, content.entry0%1 ]\nrows:';

$u.val(layoutheaders + $u.val()); 
$t.val(contentheaders + $t.val());

//fix html entities
$t.val($t.val().replace(/&gt;/g,'>').replace(/&lt;/g,'<'));
$u.val($u.val().replace(/&gt;/g,'>').replace(/&lt;/g,'<'));

//replace <li> tags with a newline, dash and a space, and strip </li> tags
$t.val($t.val().replace(/<li>/g,'\n- ').replace(/<\/li>/g,''));
$u.val($u.val().replace(/<li>/g,'\n- ').replace(/<\/li>/g,''));

//insert newlines before and after list items
$t.val($t.val().replace(/<ul>/g,'\n').replace(/<\/ul>/g,'\n'));
$u.val($u.val().replace(/<ul>/g,'\n').replace(/<\/ul>/g,'\n'));

//condense spaces
$t.val($t.val().replace(/[ ]{2,}/g,' '));
$u.val($u.val().replace(/[ ]{2,}/g,' '));

$f.val('# completed yaml\n' + $t.val() + $u.val());



//to run separately - strips parameters from URL links
$('img').each(function(i,el){x=$(el).attr('src').substring(0,$(el).attr('src').indexOf('?'));$(el).attr('src',x);});