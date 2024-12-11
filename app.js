import * as cheerio from 'cheerio';
import fs from 'fs';

const $ = await cheerio.fromURL('https://somafm.com/listen/');
const pls = fs.createWriteStream('./streaming.xml');
const replaceHTMLEntities = (str) => str.replaceAll('&', '&amp;').replaceAll('\'', '&apos;');

pls.write('<?xml version="1.0" encoding="utf-8" ?>\n')

pls.write('<urls>\n')

$('div#stations ul>li').each(function() {
	const item = {
		'title': replaceHTMLEntities($(this).find('h3').text()),
		'description': replaceHTMLEntities($(this).find('.descr').text()),
		'pls': 'https://somafm.com' + $(this).find('nobr a').eq(1).attr('href')
	};

	pls.write(`    <url name="${item.title}" br="0" type="" url="" desc="${item.description}" genre="">${item.pls}</url>\n`)
});

pls.write('</urls>');

pls.end();

