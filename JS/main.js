window.addEventListener('load', function(){

    //Variáveis para adicionar tabela
    const inputNum = document.querySelector('#num-med');
    const button = document.querySelector('#input-med');
    const table = document.querySelector('table');

    //Tabela regressão convencional
    const tableAconv = document.querySelector('#conventionalA');
    const tableMuAconv = document.querySelector('#conventionalMuA');
    const tableBconv = document.querySelector('#conventionalB');
    const tableMuBconv = document.querySelector('#conventionalMuB');
    
    //Tabela regressão ponderada
    const tableApond = document.querySelector('#ponderadaA');
    const tableMuApond = document.querySelector('#ponderadaMuA');
    const tableBpond = document.querySelector('#ponderadaB');
    const tableMuBpond = document.querySelector('#ponderadaMuB');
    
    //Adiciona células em um array
    const linhaArray = [];//cada linha em um array
    //cada coluna em um array
    const coluna0 = [];
    const coluna1 = [];
    const coluna2 = [];
    const coluna3 = [];
    
    //Váriavel para calcular
    const calcule = document.querySelector('#calcularRegre');
    //Conjuntos de dados de entrada e calculados
    let x = [];
    let y = [];
    let xQuadrado = [];
    let yQuadrado = [];
    let xy = [];
    let sigma = [];
    let w = [];
    let wx = [];
    let wy = [];
    let wxQuadrado = [];
    let wxy = [];
    //Btransf
    let Btransf = 0;
    //somatórios
    let sumX = 0;
    let sumY = 0;
    let sumXquadrado = 0;
    let sumYquadrado = 0;
    let sumXY = 0;
    let sumW = 0;
    let sumWX = 0;
    let sumWY = 0;
    let sumWXQuadrado = 0;
    let sumWXY = 0;
    //regressão convencional
    let delta = 0;
    let Aconv = 0;
    let Bconv = 0;
    let fator1 = 0;
    let fator2 = 0;
    let sigmay = 0;
    let muAconv = 0;
    let muBconv = 0;
    //regressão ponderada
    let deltaPond = 0;
    let Apond = 0;
    let Bpond = 0;
    let muApond = 0;
    let muBpond = 0;

    //Evento de escuta no botão adicionar
    button.addEventListener('click', adicionarTabela);

    //Evento de escuta no botão calcular
    calcule.addEventListener('click', calcularRegre);

    function adicionarTabela(){//Adicionar células na tabela
        
        for(let i = 0; i < inputNum.value; i++){
            const row = document.createElement('tr');//cria linhas
            table.appendChild(row);//adiciona linhas
            row.setAttribute('id', `linha${i}`);//Adiciona id nas linhas
            row.setAttribute('class', 'row');//Adiciona as classes
            
            for(let i = 0; i < 4; i++){
                const column = document.createElement('td');//cria colunas
                row.appendChild(column).innerHTML = `<input type="number" class="column__input">`;//adiciona inputs nas células
                column.setAttribute('id', `coluna${i}`);//Adiciona ID nas colunas
                column.setAttribute('class', 'column');//Adiciona a classe
            };
        };
        
        adicionarArrayLinha();
        salvarColuna();
    };
    
    function adicionarArrayLinha(){ //função adicionar no array
        for(let i = 0; i < inputNum.value; i++){
            const linhaN = document.querySelector(`#linha${i}`);//Adiciona em um variável
            linhaArray.push(linhaN);//adiciona no array Linha
        };
    };
    
    function salvarColuna(){//salva cada coluna em um array
        for(let i = 0; i < inputNum.value; i++){
            //Busca uma linha por vez e acessa o filho respectivo a cada coluna
            coluna0.push(linhaArray[i].children[0].firstChild);
            coluna1.push(linhaArray[i].children[1].firstChild);
            coluna2.push(linhaArray[i].children[2].firstChild);
            coluna3.push(linhaArray[i].children[3].firstChild);
        };
    };

    function calcularRegre(){
        verificaInput();
        calcularSomatorio();
        RegressaoConvencional();
        RegressaoPonderada();
    }

    function verificaInput(){
        for(let i = 0; i < inputNum.value; i++){
            if(coluna0[i].value == 0 || coluna1[i].value == 0 || coluna2[i].value == 0 || coluna3[i].value == 0){
                alert('Preencha a tabela com os valores')
            }
        }
    }

    function calcularSomatorio(){
        
        for(let i = 0; i < inputNum.value; i++){// laço de repetição que calucula cada termo de cada medição
            
            x[i] = Number(coluna0[i].value);
            y[i] = Number(coluna2[i].value);            
            //calcula o x e y quadrado
            xQuadrado[i] = Math.pow(x[i], 2)
            yQuadrado[i] = Math.pow(y[i], 2)
            //calcula x.y
            xy[i] =x[i]*y[i];
        }
        somatorio();
    }

    function somatorio(){// calcula os somatórios
        //varre os arrays somando cada elemento;
        sumX = x.reduce(function(acumulador, valorAtual) {
            return acumulador + valorAtual;
        }, 0)
        sumY = y.reduce(function(acumulador, valorAtual) {
            return acumulador + valorAtual;
        }, 0)
        sumXquadrado = xQuadrado.reduce(function(acumulador, valorAtual) {
            return acumulador + valorAtual;
        }, 0)
        sumYquadrado = yQuadrado.reduce(function(acumulador, valorAtual) {
            return acumulador + valorAtual;
        }, 0)
        sumXY = xy.reduce(function(acumulador, valorAtual) {
            return acumulador + valorAtual;
        }, 0)
    }

    function RegressaoConvencional(){
        //executa os calculos da regressão
        delta = inputNum.value*sumXquadrado - Math.pow(sumX, 2);
        Aconv = ((sumXquadrado*sumY)-(sumX*sumXY)) / delta;
        Bconv = ((inputNum.value*sumXY)-(sumX*sumY)) / delta;
        fator1 = 1 / (inputNum.value - 2);
        fator2 = sumYquadrado-2*Aconv*sumY-2*Bconv*sumXY+2*Aconv*Bconv*sumX+Math.pow(Bconv, 2)*sumXquadrado+inputNum.value*Math.pow(Aconv, 2); 
        sigmay = Math.sqrt(fator1*fator2);
        muAconv = sigmay*Math.sqrt(sumXquadrado/delta);
        muBconv = sigmay*Math.sqrt(inputNum.value/delta);

        adicionaConvencional();
    }

    function adicionaConvencional(){
        //adiciona o resultado a tabela
        tableAconv.innerHTML = `${Aconv}`;
        tableMuAconv.innerHTML = `${muAconv}`;
        tableBconv.innerHTML = `${Bconv}`;
        tableMuBconv.innerHTML = `${muBconv}`;
    }

    function RegressaoPonderada(){
        Btransf = Bconv;
        console.log(Btransf)

        somatorioPonderada();

        ponderada();
        
        convergencia();
    }
   
    
    function somatorioPonderada(){
        for(let i = 0; i < inputNum.value; i++){
            //calcula incerteza transferida
            sigma[i] = Math.pow(Number(coluna1[i].value), 2) + Btransf*Math.pow(Number(coluna3[i].value), 2);
            //calcula w
            w[i] = 1 / sigma[i];
            //calcula wx
            wx[i] = w[i]*x[i];
            //calcula wy
            wy[i] = w[i]*y[i];
            //calcula wx^2
            wxQuadrado[i] = w[i]*xQuadrado[i];
            //calcula wxy
            wxy[i] = w[i]*x[i]*y[i];
        }

        calculaSomatorios()
    }
    
    function calculaSomatorios(){
        sumW = w.reduce(function(acumulador, valorAtual) {
            return acumulador + valorAtual;
        }, 0)
        sumWX = wx.reduce(function(acumulador, valorAtual) {
            return acumulador + valorAtual;
        }, 0)
        sumWY = wy.reduce(function(acumulador, valorAtual) {
            return acumulador + valorAtual;
        }, 0)
        sumWXQuadrado = wxQuadrado.reduce(function(acumulador, valorAtual) {
            return acumulador + valorAtual;
        }, 0)
        sumWXY = wxy.reduce(function(acumulador, valorAtual) {
            return acumulador + valorAtual;
        }, 0)
    }
    
    function ponderada(){
        deltaPond = sumW*sumWXQuadrado - Math.pow(sumWX, 2);
        Apond = ((sumWY*sumWXQuadrado)-(sumWX*sumWXY)) / deltaPond;
        Bpond = ((sumW*sumWXY)-(sumWX*sumWY)) / deltaPond;
        muApond = Math.sqrt(sumWXQuadrado / deltaPond);
        muBpond = Math.sqrt(sumW / deltaPond);
    }

    function convergencia(){
        let Ann = Apond;
        let An = Aconv;
        let muAnn = muApond;
        let teste = Math.abs(Ann - An);
        console.log(Apond)
        console.log(muApond)
        console.log(Bpond)
        console.log(muBpond)

        while(teste <= muAnn){
            Btransf = Bpond;
            An = Apond;
            ponderada();
            Ann = Apond;
            muAnn = muApond;
            break
        }
    }
});