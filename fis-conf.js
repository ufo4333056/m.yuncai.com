// fis.match('::packager', {
//   spriter: fis.plugin('csssprites')
// });

// fis.match('*', {
//   useHash: false
// });

/*  fis.match('*.js', {
   optimizer: fis.plugin('uglify-js')
 }); */

/*  fis.match('*.css', {
   useSprite: true,
    optimizer: fis.plugin('clean-css')
 }); */

/*  fis.match('*.png', {
	 
  optimizer: fis.plugin('png-compressor')
 }); */

/* fis.match('*', {
  deploy: fis.plugin('http-push', {
    receiver: 'http://121.199.45.209/h5/receiver.php',
    to: '/home/work/htdocs' //注意这个是指的是测试机器的路径，而非本地机器
  })
}) */

fis.media('rd').match('*', {
  deploy: fis.plugin('http-push', {
    receiver: 'http://121.199.45.209/h5/receiver.php'
  })
});

/* fis.hook('relative'); 
fis.match('**', { relative: true })

//fis.match('*', {  release: '/h5/$0' });

fis.set('date', new Date);

fis.match('*.{js,css,png}', {
	 release: '/static/$0' ,
     query: '?v=' + (fis.get('date').getYear() + 1900)+ (fis.get('date').getMonth() + 1)+ (fis.get('date').getDate())
}); */

//fis.match('*.css', {deploy: [  fis.plugin('replace', {from: '/content/img/', to: '127.0.0.1/img/' }), fis.plugin('local-deliver')]});