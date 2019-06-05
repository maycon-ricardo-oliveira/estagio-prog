function limpa_formulário_cep() {

    document.getElementById('street').value=("");
    document.getElementById('district').value=("");
    document.getElementById('city').value=("");
    document.getElementById('state').value=("");

}

function meu_callback(conteudo) {

    if (!("erro" in conteudo) ) {

        document.getElementById('street').value=(conteudo.logradouro);
        document.getElementById('district').value=(conteudo.bairro);
        document.getElementById('city').value=(conteudo.localidade);
        document.getElementById('state').value=(conteudo.uf);

        $("#number").focus();

    } else {

        limpa_formulário_cep();
        alert("CEP não encontrado.");

    }
}

function pesquisacep(valor) {

    var cep = valor.replace(/\D/g, '');

    if (cep != "") {

        var validacep = /^[0-9]{8}$/;

        if(validacep.test(cep)) {

            document.getElementById('street').value="...";
            document.getElementById('district').value="...";
            document.getElementById('city').value="...";
            document.getElementById('state').value="...";

            var script = document.createElement('script');

            script.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=meu_callback';

            document.body.appendChild(script);

        } else {

            limpa_formulário_cep();
            alert("Formato de CEP inválido.");

        }

    } else {
        
        limpa_formulário_cep();

    }
    
};