import gulp from "gulp";  // es6문법, babel 을 이용하여 컴파일해줘야 함
import pug from "gulp-pug"; // pug 파일을 html로 트랜스파일링 해줌, 모듈을 설치해줘야 한다, pug
import del from "del"; // build 파일을 삭제 해줌(지정된 경로...)
import webserver from "gulp-webserver";  // 웹서버 구동, 옵션 지정에 따라 브라우저 기동, 또는 수정한 내용이 자동 반영됨


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
        src: "src/*.pug", // 컴파일할 파일, src 바로 아래 모든 pug　파일들, 하위 디렉토리 포함하려면 src/**/*.pug
        dest: "build",    // 최종 파일들을 생성할 디렉토리명
        watch: "src/**/*.pug"   // 지켜봐야할 파일, src　이하 하위 디렉토리포함하여 pug　파일들의 수정여부를 감시함
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
const clean = () => del(["build/"]);  // "build" 슬래시 유무에 따른 차이가 있나??

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

// watch
// 감시할 경로를 넣어주고, 변경사항이 일어날때 실행할 함수를 넣어줌
const watch = () => {
    // pug 파일 변경시마다, 감시하여, 컴파일되도록 정의
    gulp.watch(routes.pug.watch, pugTask);
}

// 이렇게 series　를 별도 만든 이유는 task  그룹을 만든 것임
const prepare = gulp.series([clean]);
const assets = gulp.series([pugTask]);

//const postDev = gulp.series([gulpServer]);  // 웹서버만 실행
// const postDev = gulp.series([gulpServer, watch]) // 서버실행 후, 변경파일 감시
const postDev = gulp.parallel([gulpServer, watch]) // 서버실행, 변경파일 감시 동시



// gulp.series([함수로 정의한 태스크명, 여러개인 경우 콤마(,)로 구분])
//export const dev = () => gulp.series([pugTask]);  // 에러 발생
// export const dev = gulp.series([clean, pugTask, gulpServer]);
export const dev = gulp.series([clean, pugTask, postDev]);






