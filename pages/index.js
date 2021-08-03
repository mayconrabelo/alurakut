import React from 'react';
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(propriedades){
  return(
    <Box as="aside">
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`} >
          @{propriedades.githubUser}
        </a>
      </p>
      <hr/>
      <AlurakutProfileSidebarMenuDefault/>
    </Box>
  )
}

function ProfileRelationsBox(propriedades){
  return(
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle" >
        {propriedades.title} ({propriedades.items.length})
      </h2>
        <ul>
        {propriedades.items.map((itenAtual) => {
            return(
              <li key={itenAtual.id}>
                <a href={`${itenAtual.html_url}`} >
                  <img src={`https://github.com/${itenAtual.login}.png`} />
                  <span>{itenAtual.login}</span>
                </a>
              </li>
            )
          })} 
        </ul>
    </ProfileRelationsBoxWrapper>
  )
}


export default function Home() {
  const githubUser = 'mayconrabelo';
  const pessoasFavoritas = ['handersonbf','juunegreiros','omariosouto','peas','rafaballerini','marcobrunodev']
  const [comunidades, setComunidades] = React.useState([]);

  const [seguidores, setSeguidores] = React.useState([]);
  React.useEffect(function(){
    fetch('https://api.github.com/users/mayconrabelo/followers')
    .then(function(respostaServidor){
      return respostaServidor.json();
    })
    .then(function(respostaCompleta){
      console.log(respostaCompleta);
      setSeguidores(respostaCompleta);
    })
    //api graphQL
    fetch('https://graphql.datocms.com/',{
      method: 'POST',
      headers: {
        'Authorization':'23db63fed83690d5e7d4c110c67b5f',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ "query": `query {
        allCommunities {
          title
          id
          imageUrl
          creatorSlug
        }
      }` })
    })
    .then((response) => response.json())
    .then((respostaCompleta)=>{
      const comunidadesVindasDato = respostaCompleta.data.allCommunities;
      console.log(comunidadesVindasDato)
      setComunidades(comunidadesVindasDato)
    })

  },[])

  return (
    <>
    <AlurakutMenu />
    <MainGrid>
      <div className="profileArea" style={{ gridArea: 'profileArea' }}>
        <ProfileSidebar githubUser={githubUser}/>
      </div>
      <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
        <Box >
          <h1 className="title">
          Bem vindo(a)
          </h1>
          <OrkutNostalgicIconSet />
        </Box>
        <Box>
          <h2 className="subTitle">O que você deseja fazer?</h2>
          <form onSubmit={function handleCriaComunidade(e){
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);

              console.log('Campo: ', dadosDoForm.get('title'));
              console.log('Campo: ', dadosDoForm.get('image'));

              const comunidade = {
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image'),
                creatorSlug: githubUser,
              }

              fetch('/api/comunidades',{
                method: 'POST',
                headers: {
                  'Content-Type':'application/json',
                },
                body: JSON.stringify(comunidade)
              })
              .then(async(response) =>{
                const dados = await response.json();
                const comunidade = dados.registroCriado;
                const comunidadesAtualizadas = [...comunidades, comunidade];
                setComunidades(comunidadesAtualizadas);
              })


          } }>
            <div>
              <input 
                placeholder="Qual vai ser o nome da sua comunidade?"
                name="title" 
                aria-label="Qual vai ser o nome da sua comunidade?"
                type="text" 
                /> 
            </div>
            <div>
              <input 
                placeholder="Coloque uma URL para usarmos de capa"
                name="image" 
                aria-label="Coloque uma URL para usarmos de capa" />
            </div>
            <button>
              Criar comunidade
            </button>
          </form>
        </Box>
      </div>
      <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
        <ProfileRelationsBox title="Seguidores" items={seguidores} />
        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle" >
          Pessoas da comunidade ({pessoasFavoritas.length})
          </h2>
          <ul>
            {pessoasFavoritas.map((itenAtual) => {
              return(
                <li key={itenAtual}>
                  <a href={`/users/${itenAtual}`} >
                    <img src={`https://github.com/${itenAtual}.png`} />
                    <span>{itenAtual}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </ProfileRelationsBoxWrapper>
        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
            Comunidades ({comunidades.length})
          </h2>
          <ul>
            {comunidades.map((itenAtual) => {
              return(
                <li key={itenAtual.id}>
                  <a href={`/communities/${itenAtual.id}`}>
                    <img src={itenAtual.imageUrl} />
                    <span>{itenAtual.title}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </ProfileRelationsBoxWrapper>
      </div>
    </MainGrid>
    </>
  )
}
