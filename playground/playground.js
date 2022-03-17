const fs = require("fs");
// fs.readFile("./text1.txt",(err1,data1)=>{
//     if(err1) throw err1;
//     fs.readFile("./text2.txt",(err2,data2)=>{
//       if(err2) throw err2;
//       fs.readFile("./text3.txt",(err3,data3)=>{
//         if(err3) throw err3;
//          console.log((data1+data2+data3));
//       })
//     })
// });

// const p = new Promise((resolve,reject)=>{ 
//   fs.readFile("./text1.txt",(err,data)=>{
//     if(err) reject(err);
//     resolve(data);
//   });
// });

// p.then((value)=>{
//   return new Promise((resolve,reject)=>{
//     fs.readFile("./text2.txt",(err,data)=>{
//       if(err) reject(err);
//       resolve(value + data);
//     });
//   })
// }).then((value)=>{
//   return new Promise((resolve,reject)=>{
//     fs.readFile("./text2.txt",(err,data)=>{
//       if(err) reject(err);
//       console.log(value + data);
//       resolve(value + data);
//     });
//   })
// }).catch((err)=>{
//   console.log(err);
// })

// function myReadFile(path, append=''){
//   return new Promise((resolve, reject) => {
//       fs.readFile(path, (err, data) =>{
//           if(err) reject(err);
//           resolve(append + data);
//       });
//   });
// }

// myReadFile("./text1.txt").then((value1)=>{
//   return myReadFile("./text2.txt", value1);
// }).then((value2)=>{
//   return myReadFile("./text3.txt", value2);
// }).then(value3=>{
//   console.log(value3);
// }).catch((err)=>{
//   console.log(err);
// });

function myReadFile(path){
  return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) =>{
          if(err) reject(err);
          resolve(data);
      });
  });
}
async function main(){
  try{
      let data1 = await myReadFile('./text1.txt');
      let data2 = await myReadFile('./text2.txt');
      let data3 = await myReadFile('./text3.txt');
      console.log(data1 + data2 + data3);
  }catch(e){
      console.log(e.code);
  }
}
main();