/* eslint-disable */
require('script-loader!file-saver');
import table2excel from '@/components/JSTable2excel'

/**
 * 导出带图片的excel 表头
 * @param {[{ title: '图片名称', key: 'xx', type: 'image/text', width: 100, height: 200 }]} tHeader 
 * @param {*} tableData 
 * @param {总表名称} defaultTitle 
 */
export function export_table_to_excel_image(tHeader, tableData, defaultTitle) {
  table2excel(tHeader, tableData, defaultTitle + '.xls')
}
