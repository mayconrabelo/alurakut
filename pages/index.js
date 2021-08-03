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
  const [comunidades, setComunidades] = React.useState([{
    id: '439483498',
    title: 'Nunca Fiz Amigo Bebendo Leite',
    image: 'https://55919.cdn.simplo7.net/static/55919/sku/kits-placas-decorativas-arte-cerveja-17-1591313044204.jpg'
  }]);

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
                id: new Date().toISOString(),
                title: dadosDoForm.get('title'),
                image: dadosDoForm.get('image'),
              }
              const comunidadesAtualizadas = [...comunidades, comunidade];
              setComunidades(comunidadesAtualizadas);
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
                  <a href={`/users/${itenAtual.title}`}>
                    <img src={itenAtual.image} />
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
