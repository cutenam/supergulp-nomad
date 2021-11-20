import gulp from "gulp";  // es6문법, babel 을 이용하여 컴파일해줘야 함
import pug from "gulp-pug"; // pug 파일을 html로 트랜스파일링 해줌, 모듈을 설치해줘야 한다, pug
import del from "del";

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
        src: "src/*.pug", // src 바로 아래 모든 pug　파일들, 하위 디렉토리 포함하려면 src/**/*.pug
        dest: "build",    // 최종 파일들을 생성할 디렉토리명
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

// gulp.src("원본 소스 경로")
// pipe(pug()) : import 한 pug 모듈을 호출하여, 모듈이 하는일 즉, html로 트랜스파일링 함
// pipe(gulp.dest("생성 파일 경로")) : 정의한 최종 디렉토리에 파일을 생성함
// task　명을 만들 때 규칙이 있는듯,,, pug-task로 했을 때, 모듈명 pug　와 중복된다며 오류가 발생했음;;
const pugTask = () => gulp.src(routes.pug.src)
        .pipe(pug())
        .pipe(gulp.dest(routes.pug.dest));

// del(["삭제할 디렉토리 경로"]
const clean = () => del(["build"]);

// gulp.series([함수로 정의한 태스크명, 여러개인 경우 콤마(,)로 구분])
//export const dev = () => gulp.series([pugTask]);  // 에러 발생
export const dev = gulp.series([clean, pugTask]);





