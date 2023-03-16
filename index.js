//requisições das bibliotecas que iremos utilizar
const express = require('express')
const app = express()
const uuid = require('uuid')

//porta do nosso servidor
const port = 3004

//padrão de troca de dados json
app.use(express.json())




//'banco de dados' cardapio
const menu = [
    {
        order: 'X- Burguer, 1 batata grande, 1 fanta-uva',
        price: 30.50
    },
    {
        order: 'X- Salada, 1 batatas média, 1 coca-cola',
        price: 24.99
    },
    {
        order: 'X- Tudo, 2 batatas grandes, 1 fanta-laranja',
        price: 57.80
    },
    {
        order: 'X- Egg, 1 batatas pequena, 1 guarana',
        price: 17.00
    }
]




//banco de dados onde vai armazenar os pedidos
const requests = []








//middleware que verifica se o order é igual ao order quem vem do body

const orderVerification = (req, res, next) => {
    const { order } = req.body
    const findMenu = menu.find(request => request.order === order)
    if(findMenu === undefined || findMenu === false || findMenu === null){
        res.status(404).send('<h1>Escolha uma destas opções do cardápio:</h1> <p>X- Burguer, 1 batata grande, 1 fanta-uva</p> <p>X- Salada, 1 batatas média, 1 coca-cola</p> <p>X- Tudo, 2 batatas grandes, 1 fanta-laranja</p> <p>X- Egg, 1 batatas pequena, 1 guarana</p>')

    }

    req.orderFind = findMenu

    next()
}










//middleware que verifica o id do cliente com o id do parametro

const idVerfication = (req, res, next) => {
    const { id } = req.params
    const index = requests.findIndex(order => order.id === id)
    if(index < 0){
        res.status(404).json({message: 'id Not Found'})
    }


    req.indexId = index


    next()
}







//rota post/order responsável por criar os pedidos

app.post('/order', orderVerification, (req, res) => {
    const { order, price } = req.orderFind
    const { clientName } = req.body

    const orderCreated = { id: uuid.v4(), clientName, order, price, status: 'Em preparação...' }
    requests.push(orderCreated)

    return res.status(201).json(orderCreated)
})







//rota que mostra todos os pedidos criados

app.get('/order', (req, res) => {


    return res.json(requests)
})









//rota que atualiza os pedidos criados 

app.put('/order/:id', idVerfication, orderVerification, (req, res) => {
    const { order, price } = req.orderFind
    const { id } = req.params
    const index = req.indexId
    const { clientName } = req.body
    const updateOrder = { id, clientName, order, price, status: "Em preparação..." }

    requests[index] = updateOrder

    res.json(updateOrder)


})








//rota que deleta algum dos pedidos já feitos

app.delete('/order/:id', idVerfication, (req, res) => {
    const index = req.indexId

    requests.splice(index, 1)

    return res.json({ message: 'deleted' })

})








//rota que retorna um pedido especifico ja criado

app.get('/order/:id', idVerfication, (req, res) => {
    const index = req.indexId
    const request = requests[index]

    return res.json(request)

})






//rota que altera o status do pedido

app.patch('/order/:id', idVerfication, (req, res) => {
    const index = req.indexId
    requests[index].status = 'Pronto!'
    const status = requests.filter(request => request.status === 'Pronto!')

    return res.json(status)
})









app.listen(port, () => console.log('🚀 o server está rodando na porta' + ' ' + port))

