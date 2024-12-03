import { useState } from 'react';
import {createActor, icpsubaccount_backend} from 'declarations/icpsubaccount_backend';
import {AuthClient} from "@dfinity/auth-client"
import {HttpAgent} from "@dfinity/agent";

let actorBackend = icpsubaccount_backend;

function App() {  

  const [isLoggedIn, setIsLoggedIn] = useState(false); // Utilizado para apresentar os botão Login e Logout

  async function gerarSubAccount() {

      // Criar o authClient
      let authClient = await AuthClient.create();

      // Inicia o processo de login e aguarda até que ele termine
      await authClient.login({
        // Redireciona para o provedor de identidade da ICP (Internet Identity)
        identityProvider: "https://identity.ic0.app/#authorize",
        onSuccess: async () => {   
          // Caso entrar neste bloco significa que a autenticação ocorreu com sucesso!
          const identity = authClient.getIdentity();
          console.log("Principal obtido no frontend: " + identity.getPrincipal().toText()); // Já é possivel ter acesso ao Principal do usuário atenticado         
          
          /* A identidade do usuário autenticado poderá ser utilizada para criar um HttpAgent.
             Ele será posteriormente utilizado para criar o Actor (autenticado) correspondente ao Canister de Backend  */
          const agent = new HttpAgent({identity});
          /* O comando abaixo irá criar um Actor Actor (autenticado) correspondente ao Canister de Backend  
            desta forma, todas as chamadas realizadas a metodos SHARED no Backend irão receber o "Principal" do usuário */
            actorBackend = createActor(process.env.CANISTER_ID_ICPSUBACCOUNT_BACKEND, {
              agent,
          });          
          
          //Obtem o Principal autenticado no Actor
          const principalText = await actorBackend.get_principal_client();          

          let userId = document.getElementById("userId").value;
          //Gera uma SubAccount para o usuário autenticado com base no identificador informado
          const subAccountText = await actorBackend.assign_subaccount(userId);                    
          
          document.getElementById("principalText").innerText = principalText;        
          document.getElementById("subAccountText").innerText = subAccountText;        

          console.log(principalText);
          console.log(subAccountText);

          setIsLoggedIn(true);

        },
        
        windowOpenerFeatures: `
                                left=${window.screen.width / 2 - 525 / 2},
                                top=${window.screen.height / 2 - 705 / 2},
                                toolbar=0,location=0,menubar=0,width=525,height=705
                              `,
      })
      
      return false;
      
  };
 

  document.addEventListener("DOMContentLoaded", function() {    
     document.getElementById("logout").style.display = "none";
  });

  return (
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <br />

      <div class="instructions-container">
        <h1>Para gerar uma SubAccount siga os passos abaixo:</h1>
        <ul class="instructions-list">
          <li>Informe um identificador para gerar a SubAccount.</li>
          <li>Clique no botão <strong>Gerar SubAccount</strong>. Caso o usuário não estiver autenticado na rede, será solicitado o Internet Identity.</li>
          <li>Será gerado um número para a SubAccount no formato de array de 32 bytes (Blob).</li>
        </ul>       

        <div class="container_fields">
          <label>Informe um identificador único: </label>
          <input type="text" id="userId"  />
          <button id="gerar" onClick={gerarSubAccount}>Gerar SubAccount</button> 
        </div>     

      </div>

      <br/>
      
      <div class="container">
        <label>Principal: </label><label id="principalText"></label>
        <br/>
        <label>SubAccount: </label><label id="subAccountText"></label>
      </div>               
      
    </main>
  );
}

export default App;

