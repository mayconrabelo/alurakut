import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequests(request,response){

    if(request.method === 'POST'){
        const TOKEN = '1a04964027cac9b8b03c87de7bc13c';
        const client = new SiteClient(TOKEN);

        const registroCriado = await client.items.create({
            itemType: "1049801",
            ...request.body,
            //title: "teste",
            //imageUrl:"https://github.com/mayconrabelo.png",
            //creatorSlug:"mayconrabelo"
        })

        response.json({
            dados: 'algum dado qualquer',
            registroCriado: registroCriado,
        })
        return;
    }
    response.status(404).json({
        mensagen: 'ainda nao temos nada no GET, mas no POST tem!'
    }) 
}