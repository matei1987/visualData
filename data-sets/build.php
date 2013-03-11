<?php
/**
 * Build some datasets from the CSV files and import them to JSON
 *
 * @package visualdata
 */

$year = '2013';
$sets = [
	'education',
	'health-care',
	'pensions'
];

// ===========================
// Start Building...
// ===========================
$folder = __DIR__.'/'.$year.'/';

echo 'Starting the sets...'.PHP_EOL;
echo '======================'.PHP_EOL;

foreach($sets as $s) :
	$data = str_getcsv( file_get_contents($folder.'/'.$s.'.csv') );
	$file_write = $folder.$s.'.json';
	file_put_contents($file_write, json_encode($data));

	echo 'Wrote '.$s.' '.$year.PHP_EOL;
endforeach;

echo '======================'.PHP_EOL;
echo 'Done!'.PHP_EOL.PHP_EOL;