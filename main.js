const app = Vue.createApp({
    data(){
        return{
            unity: "",
            value: "",
            input2: 0,
            deviceApi: "https://api.apilayer.com/exchangerates_data/latest?base=USD",
            price:"",
            rates: {}
        }
    },
    methods:{
        async fetchDeviseApi(){
            let resp = await fetch(this.deviceApi, {headers: {"apikey":"YOUR API KEY"}});
            resp = await resp.json();
            this.rates = resp.rates;
            console.log(this.rates)
            this.deviseOptions();
        },
        deviseOptions(){
            const sel1= document.querySelector(".convert .input select");
            const sel2= document.querySelector(".convert .output select");
            let value = "";
            Object.keys(this.rates).forEach(code=>{
                let str = `<option value= "${code}">${code}</option>`;
                value += str;
            })
            sel1.innerHTML = value;
            sel2.innerHTML = value;

            sel1.addEventListener('change', ()=>{
                this.displayRate(sel1, sel2)
            })
            sel2.addEventListener('change', ()=>{
                this.displayRate(sel1, sel2)
            })
        },
        displayRate(sel1, sel2){
            let val1 = sel1.value;
            let val2 = sel2.value;

            let val = this.convert(1, val2);

            this.unity = `1 ${val1} égale`
            this.value = `${val} ${val2}`

            const input1 = document.querySelector(".convert .input input");
            
            input1.addEventListener("input", ()=>{
                let fromVal = parseFloat(this.price);
                let ouputCurr = sel2.value;

                let conv = this.convert(fromVal, ouputCurr)
                if(!isNaN(conv)){
                    this.input2 = conv;
                    console.log(this.input2)
                }else{
                    this.input2 = 0
                }
            })

        }
    },
    mounted(){
        this.fetchDeviseApi()
    },
    computed: {
        convert() {
            return (val, ouputCurr) => {
                const inputValue = typeof val === 'object' ? val.valueOf() : val;
                const outputRate = typeof this.rates[ouputCurr] === 'object' ? this.rates[ouputCurr].valueOf() : this.rates[ouputCurr];

                let v = inputValue * outputRate;
                let v1 = v.toFixed(3);
                return v1 == 0.0 ? v.toFixed(5) : v1;
            }
        }
    }

})