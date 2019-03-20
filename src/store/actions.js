
export const send = async () => {
    class Foo {
        constructor(x){
            this.x = x;
        }
        say(){
            console.log(this.x);
        }
    }
    const foo = new Foo(123); // class test
    try {
        return await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('async test');
            }, 1000);
        });
    } catch (err) {
        console.log(err);
    }
}

export const get = ()=>{
    return 'get';
}