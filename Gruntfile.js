module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        release: {
            github: {
                repo: 'TryGhost/Ignition',
                accessTokenVar: 'GITHUB_ACCESS_TOKEN'
            }
        }
    });

    grunt.loadNpmTasks('grunt-release');
};