module.exports = {
  forbidden: [],
  options: {
    doNotFollow: {
      path: ['node_modules']
    },
    exclude: 'node_modules',
    tsPreCompilationDeps: false,
    includeOnly: '^src',
    reporterOptions: {
      dot: {
        // Group files into top-level folders (like src/pages, src/components)
        collapsePattern: '^(src/[^/]+)',
        theme: {
          graph: {
            rankdir: 'LR', // layout: Left to Right
            splines: 'polyline'
          },
          modules: {
            color: 'lightblue',
            shape: 'box'
          },
          dependencies: {
            color: 'gray'
          }
        }
      },
      html: {
        collapsePattern: '^(src/[^/]+)'
      }
    }
  }
};
