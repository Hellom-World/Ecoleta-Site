function populateUFs() {
    var ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then(res => res.json())
    .then(states => {
        
        for(var state of states){
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
         }     
    })
}
populateUFs()

    function getCities(event){
        const citySelect = document.querySelector("[name=city]")
        const stateInput = document.querySelector("[name=state]")

        const ufValue = event.target.value
        const indexOfSelectedState = event.target.selectedIndex
        stateInput.value = event.target.options[indexOfSelectedState].text
        const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

        citySelect.innerHTML = "" /* Comando para limpar o select city caso troque o select Estado */
        citySelect.disabled = true

        fetch(url)
        .then( res => res.json()) 
        .then( cities => {
            citySelect.innerHTML = ""
        
             for(const city of cities){ 
                citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
            } 

            citySelect.disabled = false
        })
    }
        document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)


    // Itens de Coleta
    // pegar todos os li's
    const itensToCollet = document.querySelectorAll(".itens-grid li")

    for (const item of itensToCollet){
        item.addEventListener("click", handleSelectedItem)
    }
    
    //Atualizar o campo escondido no html com os itens selecionados
    const collectedItems = document.querySelector("input[name=items]")

    let selectedItems = [] /* Array que recebe os li's selecionados */


    function handleSelectedItem(event){
        const itemLi = event.target

        //Adicionar ou remover uma classe com javascript
        itemLi.classList.toggle("selected") /* .toggle adiciona se a class não existir e remove se a class ja exitir. .add adiciona uma class e .remove remove uma classe */
        
        const itemId = itemLi.dataset.id /* Dataset.id busca o numero dos li's (data-id="numero") quando clicados */
        

        //verificar se existem itens selecionados, se sim
        //pegar os itens selecionados
        const alreadySelected = selectedItems.findIndex(item => {
            const itemFoud = item == itemId //isso sera true ou false
            return itemFoud
        }) 
    
        //se já estiver selecionado,  
        if(alreadySelected >= 0){
            //tirar da seleção
            const filteredItems = selectedItems.filter(item =>{
                const itemIsDifferent =  item != itemId //false
                return itemIsDifferent
            })

            selectedItems = filteredItems
        } else {
            //se não estiver selecionado, adicionar à seleção
            selectedItems.push(itemId)
        }
        
        //Atualizar o campo escondido no html com os itens selecionados
        collectedItems.value = selectedItems   

    }