/**
 * @class GetIt.GridPrinter
 * @author Ed Spencer (edward@domine.co.uk)
 * Helper class to easily print the contents of a grid. Will open a new window with a table where the first row
 * contains the headings from your column model, and with a row for each item in your grid's store. When formatted
 * with appropriate CSS it should look very similar to a default grid. If renderers are specified in your column
 * model, they will be used in creating the table. Override headerTpl and bodyTpl to change how the markup is generated
 * 
 * Usage:
 * 
 * var grid = new Ext.grid.GridPanel({
 *   colModel: //some column model,
 *   store   : //some store
 * });
 * 
 * Ext.ux.GridPrinter.print(grid);
 * 
 */
Opt.ux.GridPrinter = {
  /**
   * Prints the passed grid. Reflects on the grid's column model to build a table, and fills it using the store
   * @param {Ext.grid.GridPanel} grid The grid to print
   */
  print: function(grid) {
    //We generate an XTemplate here by using 2 intermediary XTemplates - one to create the header,
    //the other to create the body (see the escaped {} below)
    var columns = [];
    Ext.each(grid.getColumns(), function(column) {
	if (column.getXType() != 'actioncolumn') {
		columns.push(column);
	}
    });
    
    //build a useable array of store data for the XTemplate
    var data = [];
    	grid.store.each(function(record){
		var convertedData = [];
        	Ext.each(columns, function(column) {
			var style = {};
			var align = column.getConfig('align');
			if (column.dataIndex) {
				column.printIndex = column.dataIndex;
				var val = record.get(column.dataIndex);
				if(column.xtype == 'checkcolumn') {
					convertedData[column.dataIndex] = val ? '<i class="fa fa-check"></i>' : '';					
					column.printStyle = 'text-align:center;';
				} else {
					convertedData[column.dataIndex] = column.renderer ? column.renderer(val,style,record) : val;
				}
        		} else {
				column.printIndex = column.id;
				convertedData[column.id] = column.renderer ? column.renderer({},style,record) : null;
			}
			if (align) column.printStyle = 'text-align:' + align + ';';
        	}, this);

      		data.push(convertedData);
	});

    //use the headerTpl and bodyTpl XTemplates to create the main XTemplate below
    var headings = this.headerTpl.apply(columns);
    var body     = this.bodyTpl.apply(columns);
    var gridTitle = grid.getTitle();

    if (!gridTitle ) {
	gridTitle = grid.printTitle;
    }

    if (!gridTitle ) {
	gridTitle = 'Таблица';
    }

    var tableTitle =  gridTitle.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "");
    
    var template = new Ext.XTemplate(
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
      '<html>',
        '<head>',
          '<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />',
	  '<link rel="shortcut icon" href="favicon.ico" type="image/x-icon">',
	  '<link type="text/css" rel="stylesheet" href="css/font-awesome/font-awesome-all.css" />',
	  '<link type="text/css" rel="stylesheet" href="css/main.css" />',
          '<link type="text/css" rel="stylesheet" href="css/print.css?' + Date.now() + '" />',
          '<title>' + tableTitle + '</title>',
        '</head>',
        '<body>',
	  '<h3>' + tableTitle + '</h3>',
          '<table class="print grid">',
            headings,
            '<tpl for=".">',
              body,
            '</tpl>',
          '</table>',
        '</body>',
      '</html>'
    );

	var html = template.apply(data);
    
    	//open up a new printing window, write to it, print it and close
    	var win = window.open('', 'printgrid' + Date.now());
    
    	win.document.write(html);
	win.document.close();
  },
  
  /**
   * @property stylesheetPath
   * @type String
   * The path at which the print stylesheet can be found (defaults to '/stylesheets/print.css')
   */
  stylesheetPath: '/css/print.css',
  
  /**
   * @property headerTpl
   * @type Ext.XTemplate
   * The XTemplate used to create the headings row. By default this just uses <th> elements, override to provide your own
   */
  headerTpl:  new Ext.XTemplate(
    '<tr>',
      '<tpl for=".">',
        '<th>{text}</th>',
      '</tpl>',
    '</tr>'
  ),
   
   /**
    * @property bodyTpl
    * @type Ext.XTemplate
    * The XTemplate used to create each row. This is used inside the 'print' function to build another XTemplate, to which the data
    * are then applied (see the escaped dataIndex attribute here - this ends up as "{dataIndex}")
    */
  bodyTpl:  new Ext.XTemplate(
    '<tr>',
      '<tpl for=".">',
        '<td style="{printStyle}">\{{printIndex}\}</td>',
      '</tpl>',
    '</tr>'
  )
};