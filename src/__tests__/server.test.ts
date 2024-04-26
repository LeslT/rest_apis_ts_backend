import { connectDB } from "../server"
import db from '../config/db'

// describe('GET /api', ()=>{
//     it('should send back a json response', async () => {
//         const res = await request(server).get('/api')
//         expect(res.status).toBe(200)
//         expect(res.headers['content-type']).toMatch(/json/)

//         expect(res.status).not.toBe(404)
//         expect(res.body.msg).not.toBe('desde api')
//     })
// })

jest.mock('../config/db')
describe('connectDB', ()=> {
    it('Should handle data base connection arror', async () => {
        jest.spyOn(db, 'authenticate').mockRejectedValueOnce(new Error("Error conectando a la BD"))

        const consoleSpy = jest.spyOn(console, 'log')
        await connectDB()
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining("Error conectando a la BD")
        )
    })
})
