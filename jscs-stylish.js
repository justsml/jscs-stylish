'use strict';
var chalk = require( 'chalk' );
var table = require( 'text-table' );
var path = require( 'path' );

/**
 * @param {Errors[]} errorsCollection
 */
module.exports = function( errorsCollection ) {
  var errorCount = 0,
      pathErrorCounts = {};
  /**
   * Formatting every error set.
   */
  var report = errorsCollection.map( function( errors ) {
    if ( ! errors.isEmpty() ) {
      errorCount += errors.getErrorCount();

      var output = errors.getErrorList().map( function( error ) {
        return [
          '',
          chalk.white( error.line ),
          chalk.gray( error.column ),
          process.platform !== 'win32' ? chalk.blue( error.message ) : chalk.cyan( error.message )
        ];
      } );
      var base = path.dirname( errors.getFilename() );
      if ( pathErrorCounts[base] ) {
        pathErrorCounts[base] += errors.getErrorCount();
      } else {
        pathErrorCounts[base] = errors.getErrorCount();
      }
      return [
        '',
        chalk.underline( errors.getFilename() ),
        chalk.red( '    Errors: ' + output.length ),
        table( output ),
        ''
      ].join('\n');
    }
    return '';
  });

  if ( errorCount ) {
    // Output results
    console.log( report.join('') );
    console.log( chalk.bold( '    Total Error #: ' ) + chalk.red( errorCount ) );
    var errSummary = Object.keys(pathErrorCounts)
    .map(function(key) {
      return ['    ', pathErrorCounts[key], key]
    })
    console.log( table( errSummary ) );
  } else {
    //console.log( 'No code style errors found.' );
  }
};

// Expose path to reporter so it can be configured in e.g. grunt-jscs-checker
module.exports.path = __dirname;
