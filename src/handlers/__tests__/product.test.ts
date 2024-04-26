import request from "supertest"
import server from "../../server"

describe('POST /api/products', ()=>{
    it('should display validation errors', async ()=> {
        const res = await request(server).post('/api/products').send({})
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(4)

        expect(res.status).not.toBe(201)
        expect(res.body).not.toHaveProperty('data')
    })

    it('should validate that the price is greater than 0', async ()=> {
        const res = await request(server).post('/api/products').send({name: 'Monitor - test', price: 0})
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(1)

        expect(res.status).not.toBe(201)
        expect(res.body).not.toHaveProperty('data')
        expect(res.body.errors).not.toHaveLength(4)
    })

    it('should validate that the price is a number and greater than 0', async ()=> {
        const res = await request(server).post('/api/products').send({name: 'Monitor - test', price: "Hola"})
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(2)

        expect(res.status).not.toBe(201)
        expect(res.body).not.toHaveProperty('data')
        expect(res.body.errors).not.toHaveLength(4)
    })


    it('should create a new product', async ()=> {
        const res = await request(server).post('/api/products').send({name: "Mouse - testing", price: 50})
        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('data')

        expect(res.status).not.toBe(404)
        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('errors')
    })
})

describe('GET /api/products', ()=> {
    it('should check if api/products url exists', async () => {
        const res = await request(server).get('/api/products')
        expect(res.status).not.toBe(404)
    })

    it('GET a Json response with products', async () => {
        const res = await request(server).get('/api/products')
        expect(res.status).toBe(200)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data).toHaveLength(1)

        expect(res.body).not.toHaveProperty('errors')
    })
})

describe('GET /api/products/:id', () => {
    it('Should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const res = await request(server).get(`/api/products/${productId}`)

        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error')
    })

    it('Should check a valid id in the URL', async ()=> {
        const res = await request(server).get('/api/products/not-valid-id')
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(1)
    })

    it('get a JSON response for a single product', async ()=> {
        const res = await request(server).get('/api/products/1')
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')
    })

})

describe('PUT /api/prodducts/:id', () => {
    it('Should check a valid id in the URL', async ()=> {
        const res = await request(server).put('/api/products/not-valid-id').send({ 
            name: "Monitor - test",
            availability: true,
            price: 300
        })
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(1)
    })

    it('Should display validation error messages when updating a product', async () => {
        const res = await request(server).put('/api/products/1').send({})

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toBeTruthy()
        expect(res.body.errors).toHaveLength(5)

        expect(res.body).not.toHaveProperty('data')
        expect(res.status).not.toBe(200)
    })

    it('Should validate that the price is grater than 0', async () => {
        const res = await request(server).put('/api/products/1').send({ 
            name: "Monitor - test",
            availability: true,
            price: -300
        })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toBeTruthy()
        expect(res.body.errors).toHaveLength(1)

        expect(res.body).not.toHaveProperty('data')
        expect(res.status).not.toBe(200)
    })

    it('Should retunr a 404 response for a non-existent product', async () => {
        const productId = 2000
        const res = await request(server).put(`/api/products/${productId}`).send({ 
            name: "Monitor - test",
            availability: true,
            price: 30
        })

        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toBe('Producto no encontrado')

        expect(res.body).not.toHaveProperty('data')
        expect(res.status).not.toBe(200)
    })

    it('shpuld update an existing product with valid data', async () => {1
        const res = await request(server).put(`/api/products/1`).send({ 
            name: "Monitor - test",
            availability: true,
            price: 30
        })

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')

        expect(res.body).not.toHaveProperty('errors')
        expect(res.status).not.toBe(400)
    })
})

describe('PATCH /api/products/:id', ()=> {
    it('Should return a 404 response for a non-existing product', async () => {
        const productId = 2000
        const res = await request(server).patch(`/api/products/${productId}`)

        expect(res.status).toBe(404)

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')
    })

    it('Should update the product availability', async () => {
        const res = await request(server).patch('/api/products/1')

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')

        expect(res.status).not.toBe(400)
        expect(res.body).not.toHaveProperty('error')
    })

})

describe('DELETE /api/products/:id', () => {
    it('Should check a valid ID', async ()=> {
        const res = await request(server).delete('/api/products/id-not-valid')

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
    })

    it('Should return a 404 response for a non-existing product', async ()=> {
        const productId = 2000
        const res = await request(server).delete(`/api/products/${productId}`)

        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error')

        expect(res.status).not.toBe(200)
        
    })
    
    it('Should delete a product', async ()=> {
        const res = await request(server).delete(`/api/products/1`)

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')

        expect(res.status).not.toBe(404)
        
    })
})
