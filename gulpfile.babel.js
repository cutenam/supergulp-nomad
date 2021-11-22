import gulp from "gulp";  // es6문법, babel 을 이용하여 컴파일해줘야 함
import pug from "gulp-pug"; // pug 파일을 html로 트랜스파일링 해줌, 모듈을 설치해줘야 한다, pug
import del from "del"; // build 파일을 삭제 해줌(지정된 경로...)
import webserver from "gulp-webserver";  // 웹서버 구동, 옵션 지정에 따라 브라우저 기동, 또는 수정한 내용이 자동 반영됨
import image from "gulp-image";  // 이미지 최적화

import sass from "gulp-sass";  // sass 컴파일 모듈
sass.compiler = require("node-sass");  // gulp-sass 4.x　버전의 경우

import autoprefixer from "gulp-autoprefixer";  // 구형 브라우저에게 CSS 호환가능하도록 하는 모듈
import csso from "gulp-csso";       // css minified 모듈
import bro from "gulp-bro";
import babelify from "babelify";
import ghpages from "gulp-gh-pages";

//task 정의
/*
function 을 export 또는 const　하는 방법을 정의 함
 */

// package.json 에  "dev": "gulp dev" 부분이 있는데, 이를 제대로 실행하게 하기 위해서는,
// dev 라는 이름의 function을 만들어줘야 함
// export const dev = () => console.log("I will dev");

// 경로들을 공통 객체로 정의함
const routes = {
    pug: {
        src: "src/*.pug",       // 컴파일할 파일, src 바로 아래 모든 pug　파일들, 하위 디렉토리 포함하려면 src/**/*.pug
        dest: "build",          // 생성한 파일을 위치시킬 디렉토리, 위치
        watch: "src/**/*.pug"   // 지켜봐야할 파일, src　이하 하위 디렉토리포함하여 pug　파일들의 수정여부를 감시함
    },
    img: {
        src: "src/img/*" ,  // * 디렉토리 이하 모든 파일
        dest: "build/img"
    },
    scss: {
        src: "src/scss/*.scss",  // 컴파일할 scss 파일, 파일명을 단독으로 명시하는 것은 해당파일만 트랜스파일한다는 의미
        dest: "build/css",          // 생성할  css 파일
        watch: "src/scss/**/*.scss"   // 지켜봐야할 파일, scss　이하 하위 디렉토리포함하여 scss　파일들의 수정여부를 감시함
    },
    js:{
        src: "src/js/main.js",
        dest: "build/js",
        watch: "src/js/**/*.js"

    }
}

// task : pug　트랜스파일링
// export const pug = () => {
//     return src("./src/*.pug")
//         .pipe(
//             pug({ 트랜스파일링 관련 옵션들을 넣어주는 곳
//
//             })
//         )
//         .pipe(dest(""))
// }

// gulp.src("원본 소스 경로 - 컴파일할 파일")
// pipe(pug()) : import 한 pug 모듈을 호출하여, 모듈이 하는일 즉, html로 트랜스파일링 함
// pipe(gulp.dest("생성 파일 경로")) : 정의한 최종 디렉토리에 파일을 생성함
// task　명을 만들 때 규칙이 있는듯,,, pug-task로 했을 때, 모듈명 pug　와 중복된다며 오류가 발생했음;;
const pugTask = () => gulp.src(routes.pug.src)
                        .pipe(pug())
                        .pipe(gulp.dest(routes.pug.dest));

// del(["삭제할 디렉토리 경로"]
// const clean = () => del(["build/"]);  // "build" 슬래시 유무에 따른 차이가 있나??
const clean = () => del(["build/", ".publish"]);

// task : gulp webserver
// gulp.task('webserver', function() {
//     gulp.src('app')   // 웹서버루트
//         .pipe(webserver({
//             livereload: true,  // 파일 수정 저장시, 웹서버에 바로 반영됨
//             directoryListing: true,
//             open: true   // 서버 구동시, 브라우저 실행시켜줌
//         }));
// });

const gulpServer = () => gulp.src("build")
                            .pipe(webserver({
                                livereload: true,
                                open: true
                            }))

// 이미지 처리
// gulp.task('image', function () {
//     gulp.src('./fixtures/*')
//         .pipe(image())
//         .pipe(gulp.dest('./dest'));
// });
// 파일 용량이 커지면, 처리 시간이 오래 걸릴 수 있음
// 파일 트랜스파일링 이전 과정에 넣는 것이 좋을 수 있다.
const gulpImage = () => gulp.src(routes.img.src)
                            .pipe(image())
                            .pipe(gulp.dest(routes.img.dest));

// scss 파일 css 파일로 트랜스파일
const gulpStyles = () => gulp.src(routes.scss.src)
    .pipe(sass().on("error", sass.logError))  // sass　문법등 에러 발생시, 에러 내용 보여줌
    .pipe(autoprefixer({
        browsers:['last 2 versions']    //  각 브라우저 최신기준으로 그 2단계 이전 버전까지 호환가능하도록
    }))
    .pipe(csso())   // css minified
    .pipe(gulp.dest(routes.scss.dest));

// js es6문법을 바벨 이용하여 호환성있는 스크립트로 트랜스파일링
const gulpJs = () => gulp.src(routes.js.src)
    .pipe(bro({
        transform: [
            babelify.configure({
                //presets: ["es2015"]
                presets:["@babel/preset-env"]  // gulpfile 에 설정한 preset 설정, 리액트 관련해서 필요하면 추가하면됨
            }),
            ["uglifyify", {global: true}] // uglifyify　도 설치해줘야 함, 임포트는 별도로 안함
        ]
    }))
    .pipe(gulp.dest(routes.js.dest));

// 깃허브 호스팅 기능 이용하여 페이지 배포
const gulpDeploy = () => gulp.src("build/**/*")
                         .pipe(ghpages());


// watch
// 감시할 경로를 넣어주고, 변경사항이 일어날때 실행할 함수를 넣어줌
const watch = () => {
    // pug 파일 변경시마다, 감시하여, 컴파일되도록 정의
    gulp.watch(routes.pug.watch, pugTask);
    // 이미지가 파일 변경시마다, 감시하여, 이미지 최적화 (이미지 용량에 따라 성능에 문제가 생길 수 있기때문에 판단 필요)
    gulp.watch(routes.img.src, gulpImage);
    // scss 파일 변경시마다, 감시하여, css　로 트랜스파일링
    gulp.watch(routes.scss.watch, gulpStyles);
    // js 파일 변경에 다른 바벨트랜스파일링 부분 감시
    gulp.watch(routes.js.src, gulpJs);
}

// 이렇게 series　를 별도 만든 이유는 같은 목적의 task 그룹을 만든 것 같다.
// const prepare = gulp.series([clean]);
const prepare = gulp.series([clean, gulpImage]); //　파일 컴파일 이전에 이미지 작업 진행

// const assets = gulp.series([pugTask]);
const assets = gulp.series([pugTask, gulpStyles, gulpJs]);

//const postDev = gulp.series([gulpServer]);  // 웹서버만 실행
// const postDev = gulp.series([gulpServer, watch]) // 서버실행 후, 변경파일 감시
const postDev = gulp.parallel([gulpServer, watch]) // 서버실행, 변경파일 감시 동시



// gulp.series([함수로 정의한 태스크명, 여러개인 경우 콤마(,)로 구분])
//export const dev = () => gulp.series([pugTask]);  // 에러 발생
// export const dev = gulp.series([clean, pugTask, gulpServer]);
// export const dev = gulp.series([clean, pugTask, postDev]);
// export const dev = gulp.series([prepare, pugTask, postDev]);
//export const dev = gulp.series([prepare, assets, postDev]);

// 개발소스 빌드
//export const build = gulp.series([prepare, assets]);

// 빌드파일 배포
//export const deploy = gulp.series([build, gulpDeploy])


export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, postDev]);
export const deploy = gulp.series([build, gulpDeploy, clean]);







