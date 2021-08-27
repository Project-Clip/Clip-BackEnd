# Connection between Node.js script and mySQL Databases
## 기본 환경
* 프로젝트에 mySQL 모듈을 직접 install, 또는 mySQL 묘듈을 아래의 커멘드를 사용하여 전역으로 install 해야 합니다.  
  
` npm mysql --save`
  
## Demo.js
기본적인 Node.js 스크립트와 mySQL 데이터베이스간의 연결을 보여주는 데모파일 입니다. `con` value가 mySQL 커넥션을 위한 인증정보를 담고 있습니다. `createConnection` 함수 내의 변수들에 할당
되는 값은 데모 스크립트가 실행되는 환경 및 mySQL 설정에 맞게 변동될 수 있습니다. 각각의 변수에 해당하는 인증 정보는 아래를 참고해주세요.
* host: mySQL 데이터베이스와 포트번호입니다.
* user: mySQL 데이터베이스로의 연결 시 사용할 유저 이름입니다.
* password: 사용 user의 비밀번호 입니다. (비밀번호를 설정하지 않았거나, mySQL 초기 설정된 유저 (root)를 사용하는 경우, password 값은 공백, 또는 `createConnection` 함수 내에 포함하지 
            않아도 됩니다).  
  
Demo.js 스크립트에 사용된 정보는 각각 localhost (127.0.0.1), root, password 값을 사용하고 있습니다.  

이후, `con` 변수에 할당된 `connection`을 사용하여 `connect` 함수를 호출 합니다. `connect` 함수는 인증정보를 기반으로 mySQL 데이터베이스로의 연결을 수행합니다. CallBack  함수는 아래와 
같은 형태입니다.  
  
`con.connect(function(err) {});`

CallBack 함수는 `err` value를 반환합니다. `err` value는 데이터베이스로의 연결시 발생하는 오류를 담고 있기에 해당 값을 조건문의 조건으로 활용하여 err-handling을 수행합니다. CallBack 함수가
`err` 값을 반환하지 않는다면 연결이 성공적으로 이루어진 것이기에 콘솔에 'Connected!'를 출력합니다. 연결이 올바르게 이루어졌을 경우, 아래와 같이 출력됩니다.
  
`    ~/Doc/D/P/P/Cod/Back End  node demo.js                  ✔  22:44:49   
Connected!`

## queryDemo.js
이 스크립트는 위의 Demo.js를 기반으로 연결된 데이터베이스에 query를 보내어 정보를 요청하고, 받은 정보값을 JSON Format으로 반환 합니다. Demo.js 스크립트와 동일하게 `createConnection` 함수를 
사용하여 인증정보를 담은 연결값을 변수에 할당, 데이터베이스로의 연결에 활용합니다. Demo.js 와 다른 점은, query를 보낼 database 정보 또한 인증정보에 같이 넣어주어야 한다는 점 입니다. database 정보
는 `createConnection`함수 내에 database 인자에 할당해 주어야 합니다. queryDemo.js 스크립트에서는 dramas 데이터베이스를 사용합니다.  
  
데이터베이스에 요청할 query는 prepared statement 방식으로 변수에 미리 할당합니다. 이 스크립트에서는 `SELECT * FROM test1` query를 `query` 변수에 할당하여 사용합니다.  

이후 `con` 변수에 할당된 `connection`을 사용하여 `query` 함수를 호출합니다. `query` 함수는 요청할 query를 인자로 받으며 CallBack 함수는 `err`, `results` 그리고 `fields` 값을 반환 합니다.
`err` 값은 위의 `connect` 함수의 CallBack  함수와 마찬가지로 데이터베이스로의 연결 및 query를 처리하는 과정중 발생하는 오류를 반환합니다. `results` 값은 전송한 query에 대한 database 반환 값을 
반환 합니다. `fields` 값은 반환값들과 매칭되는 Table의 Columns 레이블들을 반환 합니다.  

정상적으로 연결이 이루어지고, query가 처리되었다면 results 값에 해당 query에 대한 반환값이 저장됩니다. 해당 반환값을 `JSON.parse(JSON.stringify("STRING VALUE"))` 함수를 사용하여 JSON 형태로
변환 후 출력합니다. 연결이 올바르게 이루어졌을 경우, 아래와 유사하게 데이터에서 반환된 값들이 JSON 형태로 출력됩니다.  
  
`    ~/Doc/D/P/P/Code/Back End  node queryDemo.js                                        ✔  23:00:16 `  
`SUCCESS! Query has been processed.`  
`[ { id: 1, name: 'TEST!' } ]`  
  
#### Troble-Shooting
* 위 스크립트들을 실행하였을 때, `Error: Cannot find module 'mysql'`와 같은 오류가 출력될 경우, mySQL 모듈을 전역, 또는 해당 프로젝트가 있는 디렉토리에 install 해주세요. 사용 커멘드는 기본환경
파트를 참고해 주세요.
* 스크립트를 실행하였을 때, `Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client`
와 같은 오류가 출력될 경우, `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '설정할 패스워드';` query를 mySQL 클라이언트에서 실행해 주세요.

 
