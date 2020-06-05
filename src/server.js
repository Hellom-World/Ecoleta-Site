const express = require("express") //pedindo as informacoes do express
const server = express()

    //pegar o banco de dados
    const db = require("./database/db")

    //configurar pasta publica
    server.use(express.static("public"))

    //Habilitar o uso do req.body na aplicação
    server.use(express.urlencoded({extended: true}))

    //utilizando tamplate engine
    const nunjucks = require("nunjucks")
    nunjucks.configure("src/views", {
        express: server,
        noCache: true
    })


    //configurar caminhos da minha aplicação
    //pagina inicial
    //req: requisição
    //res: resposta
    server.get("/", (req, res) => {
        return res.render("index.html") //SendFile(Envie um arquivo) "__dirname" é uma variavel global pra contatenar com uma string que contem o caminho do index.html

    })

    server.get("/create-point", (req, res) => {
        //req.query: Query strings da nossa url
        //console.log(req.query)
    
        return res.render("create-point.html") //SendFile(Envie um arquivo) "__dirname" é uma variavel global pra contatenar com uma string que contem o caminho do index.html
    })

    server.post("/savepoint", (req, res) => {
        
        //req.body:o corpo do nosso formulario
        //console.log(req.body)
        
        //inserir dados no banco de dados
        //2. Inserir dados na tabela
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items 
        ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err){
            if(err){
                 console.log(err)
                return res.send("Erro no Cadastro!")
            }

            console.log("Cadastrado com sucesso")
            console.log(this)

            return res.render("create-point.html", {saved: true})
    }


    db.run(query, values, afterInsertData )
        
        
    })









    server.get("/search", (req, res) => {
    
        const search = req.query.search

        if(search == ""){
            //pesquisa vazia
            return res.render
            ("search-results.html", { total: 0 })
        }


    
        //Mostrar todos em caso de caixa vazia
        /* if(search == ""){
            db.all(`SELECT * FROM places`, function(err, rows){
                if(err){
                    return console.log(err)
                }

                const total = rows.length

                console.log("Aqui estão seus registros")
                console.log(rows)
                    
                return res.render("search-results.html", { places: rows, total: total }) //SendFile(Envie um arquivo) "__dirname" é uma variavel global pra contatenar com uma string que contem o caminho do index.html
                // saiu junto com o sendFile:   __dirname + "/views/ 
            })
        } */
        //Busca especifica
        db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
            if(err){
                return console.log(err)
            }

            const total = rows.length

            console.log("Aqui estão seus registros")
            console.log(rows)
                
            return res.render("search-results.html", { places: rows, total: total }) //SendFile(Envie um arquivo) "__dirname" é uma variavel global pra contatenar com uma string que contem o caminho do index.html
            // saiu junto com o sendFile:   __dirname + "/views/ 
        })
    })

//ligar o servidor
server.listen(3000)