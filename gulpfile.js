import gulp from 'gulp';
//const sass =require('gulp-sass');
//const csso =require('gulp-csso');
//const include =require('gulp-file-include');
//const htmlmin =require('gulp-htmlmin');
import fs from 'fs';
import path from 'path';
import {deleteAsync} from 'del';
//const sync =require('browser-sync').create;
import file  from 'gulp-file';
//const replace = require('gulp-replace');
//const concat = require('gulp-concat');

const __dirname = path.resolve(path.dirname(''));
console.log(__dirname);

function checkInfoFile()
{
  //console.log('checkInfoFile module: '+elemmod); 
var fileinf = "templ/template_info.json";

return fs.readFile(fileinf, (err, data) => {
      if (err) { throw err; }  
      let _fileinfdata=JSON.parse(data);
      console.log(' info -',_fileinfdata); 
    }); 
}
 
// формируем индекс проекта
function createFile() {
    const content = 'Это динамически созданный текстовый файл.';
    
    return file('dynamic_file.txt', content, { src: true })
        .pipe(dest('prod'));
};

//gulp.task('default', gulp.series('createFile'));


function html(){
  return src("templ/**.html")
  .pipe(include({
    prefix:'@@'
  }))
  .pipe(dest('prod'))
}
/*движемся по файлу источнику json и генерим посадочные стрницы, */ 
gulp.task('createListPage',function(done){
    var fileinf = __dirname+"/templ/list/list_page.json";

    return fs.readFile(fileinf, (err, data) => {
        if (err) { throw err; }  
        let listPageData = JSON.parse(data);
        const header_html = fs.readFileSync(__dirname+'/templ/parts/header_p.html', 'utf8');
        const header_page=  fs.readFileSync(__dirname+'/templ/parts/header_s.html', 'utf8');
        const footer_html = fs.readFileSync(__dirname+'/templ/parts/footer_p.html', 'utf8');
        const footer_page = fs.readFileSync(__dirname+'/templ/parts/footer_s.html', 'utf8');
        var main_index_array='';
        fs.mkdirSync(__dirname+"/prod/list", { recursive: true });
        listPageData.list_page.forEach(page => {

            
            let h_html=header_html.replace('#TITLE#', page.title);
            let p_html=header_page.replace('#HEADER_PAGE#', page.title_page);
            let htmlContent =
                `${h_html} ${p_html}  
                    ${page.description}
                    ${footer_page}
                    ${footer_html}
                `;            
            let fileName = `${page.name}.html`;
            let filePath = path.join(__dirname, 'prod/list', fileName); // Путь к папке prod

            console.log(filePath);
            fs.writeFile(filePath, htmlContent, (err) => {
                if (err) throw err;
                console.log(`Файл ${fileName} успешно создан`);
            });
            main_index_array+=`<li><a href="/list/${fileName}">${page.title_page}</a></li>`;
        });
        // вот тут дописываем основной индекс  страниц  набранным массивом
        let filePathIndex = path.join(__dirname, 'prod', 'index.html');  
        let index_page = fs.readFileSync(__dirname+'/templ/parts/index.html', 'utf8');
        let index_html=index_page.replace('#MAIN_INDEX#', main_index_array);
        let h_html=header_html.replace('#TITLE#', 'ОПИСАНИЕ ПРОЕКТА');
        let IndexContent =`${h_html} ${index_html} ${footer_html}`; 
        fs.writeFile(filePathIndex, IndexContent, (err) => {
          if (err) throw err;
          console.log(`Основной Файл ${filePathIndex} успешно создан`);
        });
        // тут генерим указатель на  список модулей  используемых 
        let filemod=__dirname+"/templ/js/info_template.json";
        fs.readFile(filemod, (err, data) => {
          if (err) { throw err; }  
          let listModData = JSON.parse(data);
          /*const header_html = fs.readFileSync(__dirname+'/templ/parts/header_p.html', 'utf8');
          const header_page=  fs.readFileSync(__dirname+'/templ/parts/header_s.html', 'utf8');
          const footer_html = fs.readFileSync(__dirname+'/templ/parts/footer_p.html', 'utf8');
          const footer_page = fs.readFileSync(__dirname+'/templ/parts/footer_s.html', 'utf8');
          */
          var data_index_array='';   
          /*заголовок таблицы модулей*/ 
          data_index_array+='<h1><a href="/">ИНДЕКС</a> Список используемых модулей в системе</h1>';
          data_index_array+='<div class="list_modules"><div class="head row">';
          data_index_array+='<div class="head cell mod_ind">Номер</div>';          
          data_index_array+='<div class="head cell mod_name">Наименование</div>';          
          data_index_array+='<div class="head cell mod_type_cont">Тип контента</div>';          
          data_index_array+='<div class="head cell mod_uses">Место использования</div>';          
          data_index_array+='<div class="head cell mod_cont">Описание</div>';          
          data_index_array+='</div>';

                
          listModData.info_tmpl.forEach(modul => {
            data_index_array+='<div class="row">';
            data_index_array+='<div class="cell mod_ind">'+modul.id+'</div>';          
            data_index_array+='<div class="cell mod_name">'+modul.name+'</div>';          
            data_index_array+='<div class="cell mod_type_cont">'+modul.type_cont+'</div>';          
            data_index_array+='<div class="cell mod_uses">'+modul.uses_pages+'</div>';          
            data_index_array+='<div class="cell mod_cont">'+modul.description+'</div>';          
            data_index_array+='</div>';
          });
          data_index_array+='</div>';// завершение таблицы
          let fileModIndex = path.join(__dirname, 'prod', 'list_modules.html');  
          let ModContent =`${h_html} ${data_index_array} ${footer_html}`; 
          fs.writeFile(fileModIndex, ModContent, (err) => {
            if (err) throw err;
            console.log(` Файл индекса модулей  ${fileModIndex} успешно создан`);
          });
  
        });  
  

        done(); // Сигнализируем о завершении задачи
    }); 
})  

function createIndex(){
  return src("templ/**.html")
  .pipe(include({
    prefix:'@@'
  }))
  .pipe(dest('prod'))
}
gulp.task('clearProd',function(){
  return deleteAsync('prod', {force: true});
})
gulp.task('copyFiles',function (done){
   gulp.src(__dirname+"/templ/js/**.*")
  .pipe(gulp.dest(__dirname+'/prod/js'));
  gulp.src(__dirname+"/templ/images/**/**.*")
  .pipe(gulp.dest(__dirname+'/prod/images'));
  gulp.src(__dirname+"/templ/images/favicon.ico")
  .pipe(gulp.dest(__dirname+'/prod/'));  
  gulp.src(__dirname+"/templ/css/**.css")
  .pipe(gulp.dest(__dirname+'/prod/css'));
  done();
})


/*exports.html=html;
exports.newfile=createFile
exports.createList=createListPage
exports.readInfoFile=checkInfoFile
exports.clearProd=clearProd
exports.copyFiles=copyFiles
*/
/* общий принцип
должен получиться статичный сайтик 
 индекс описание задачи :
 собирается из частей:
 - заголовок  html + 
 - текстовое описание + 
 -  сгенеренный список планирумых страниц( со ссылками на них
    и, возможно указатели - сделано не сделано
- футер общий  для всех - который содержит в себе ссылки на элементы
- завершение html
- дополнительно css
- js
- json data
- json base
*/
const dev = gulp.series('clearProd',gulp.parallel('copyFiles','createListPage'));
gulp.task('default',dev);



