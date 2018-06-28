/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
    // map tells the System loader where to look for things
    var map = {
        'ApplicationScripts': 'Application', // 'dist',
        '@angular': 'node_modules/@angular',
        'rxjs': 'node_modules/rxjs',
        '@angular2-material': 'node_modules/@angular2-material',
        'ng2-bs3-modal': 'node_modules/ng2-bs3-modal',
        'ng2-material-dropdown': 'node_modules/ng2-material-dropdown',
        'ng2-translate': 'node_modules/ng2-translate',
        'lodash': 'Scripts/Libraries/lodash/lodash.js',
        'ng2-file-upload':'node_modules/ng2-file-upload'
    };
    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        //Loading our App
        'ApplicationScripts': { main: 'main.js', defaultExtension: 'js' },
        'rxjs': { defaultExtension: 'js' },
        'ng2-material-dropdown': { main: 'index.js', defaultExtension: 'js' },
        'ng2-translate': { defaultExtension: 'js' },
        'ng2-file-upload': { defaultExtension: 'js' }
    };

    var ngPackageNames = [
      'common',
      'compiler',
      'core',
      'forms',
      'http',
      'platform-browser',
      'platform-browser-dynamic',
      'router',
      'router-deprecated',
      'upgrade',
    ];

    const materialPkgs = [
      'core',
      'button',
      'card',
      'checkbox',
      'grid-list',
      'icon',
      'input',
      'tabs',
      'toolbar',
      'progress-circle'
    ]

    // Individual files (~300 requests):
    function packIndex(pkgName) {
        packages['@angular/' + pkgName] = { main: 'index.js', defaultExtension: 'js' };
    }
    // Bundled (~40 requests):
    function packUmd(pkgName) {
        packages['@angular/' + pkgName] = { main: '/bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
    }

    // Most environments should use UMD; some (Karma) need the individual index files
    var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
    // Add package entries for angular packages
    ngPackageNames.forEach(setPackageConfig);

    materialPkgs.forEach((pkg) => {
        packages[`@angular2-material/${pkg}`] = { main: `${pkg}.js` };
    })

    System.config({
        map: map,
        packages: packages
    });
})(this);
