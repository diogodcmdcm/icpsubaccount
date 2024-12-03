import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Text "mo:base/Text";
import Nat8 "mo:base/Nat8";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";

actor IcpSubAccount {

  var accounts = HashMap.HashMap<Principal, Blob>(10, Principal.equal, Principal.hash);

  // Função para retornar o principal do usuário que está autenticado
  public query (message) func get_principal_client() : async Text {
      return Principal.toText(message.caller);
  };

  // Função para criar uma subconta baseada em um identificador único
  public func create_subaccount(userId: Text) : async Blob {
      // O identificador do usuário é transformado em um Blob de 32 bytes
      let hash = Text.encodeUtf8(userId); 

      let hashArray = Blob.toArray(hash); //converte em array para percorrer os itens

      var subaccount : [var Nat8] = Array.init<Nat8>(32, 0); // cria array de 32 bytes zerados

      for (i in Iter.range(0, Nat.min(31, hash.size() - 1))) {
          subaccount[i] := hashArray[i];
      };

      let immutableSubaccount = Array.freeze(subaccount); // converte para array imutavel, necessário para executar a função Blob.fromArray
      return Blob.fromArray(immutableSubaccount);

  };

  // Atribuir uma subconta a um usuário autenticado
  public shared(msg) func assign_subaccount(userId: Text): async Blob {

      var subaccount : Blob = Blob.fromArray([]);

      if(not Principal.isAnonymous(msg.caller) ){

        //Cria uma Subacount com base no identificador informado
        subaccount := await create_subaccount(userId);
        
        /* Armazena a SubAccount para o principal. Esta abordagem deverá ser tratada caso a caso de acordo com o perfil do projeto,
           dependendo da quantidade de SubAccounts que serão armazenadas outras abordagens podem ser melhores.
        */
        accounts.put(msg.caller, subaccount);

        // o bloco de comandos abaixo poderá ser dispensado, ele foi criado apenas para exibição dos dados na tela.
        let textOption : ?Text = Text.decodeUtf8(subaccount);
        switch (textOption) {
          case (null) { 
            // O blob não contém uma sequência UTF-8 válida
            Debug.print("O blob não pôde ser decodificado como UTF-8");
          };
          case (?text) {                     
            Debug.print("Subconta criada: " # text);
          };
        };

      };     
      
      return subaccount;
  };

};












