/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting causes an instance of this class to be created and
 * added to the Viewport container.
 */
Ext.define('MyApp.view.main.Main', {
    extend: 'Ext.grid.Tree',
    xtype: 'app-main',

    requires: [
      'Ext.data.TreeStore'
    ],

    columns: [{
      xtype: 'treecolumn',
      text: 'Name',
      dataIndex: 'text',
      minWidth: 100,
      flex: 1,
      cell: {
        checkable: true
      }
    }],

    store: {
      type: 'tree',
      root: {
        text: 'Genre',
        expanded: true,
        checkable: false, // this node doesn't want to be checkable
        children: [{
          text: 'Comedy',
          expanded: true,
          children: [{
            leaf: true,
            text: '30 Rock',
            checked: true
          }, {
            leaf: true,
            text: 'Arrested Development'
          }, {
            leaf: true,
            text: 'Bob\'s Burgers'
          }, {
            leaf: true,
            text: 'Curb your Enthusiasm'
          }, {
            leaf: true,
            text: 'Futurama'
          }]
        }, {
          text: 'Drama',
          expanded: true,
          children: [{
            leaf: true,
            text: 'Breaking Bad',
          }, {
            leaf: true,
            text: 'Game of Thrones',
            checked: true
          }, {
            leaf: true,
            text: 'Lost'
          }, {
            leaf: true,
            text: 'Preacher',
            checked: 'tri'
          }, {
            leaf: true,
            text: 'The Wire'
          }]
        }, {
          text: 'Science Fiction',
          expanded: true,
          children: [{
            leaf: true,
            text: 'Black Mirror'
          }, {
            leaf: true,
            text: 'Doctor Who'
          }, {
            leaf: true,
            text: 'Eureka'
          }, {
            leaf: true,
            text: 'Futurama'
          }, {
            leaf: true,
            text: 'The Twilight Zone'
          }, {
            leaf: true,
            text: 'X-Files'
          }]
        }]
      }
    }
  });
