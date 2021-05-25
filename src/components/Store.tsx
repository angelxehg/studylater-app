import React, { createContext, useContext, useEffect, useState } from 'react';
import { useFirestore, useFirestoreDocData, useUser } from 'reactfire';

interface SimpleDocLink {
  name: string
  url: string
}

interface MainDocModel {
  documents?: SimpleDocLink[]
}


interface DocumentRef {
  name: string
  url: string
  offline: boolean
}

type StoreContextType = {
  documents: DocumentRef[]
}

const defaultStoreContext: StoreContextType = {
  documents: []
}

const StoreContext = createContext<StoreContextType>(defaultStoreContext);

export const useStore = () => useContext<StoreContextType>(StoreContext)

interface StoreContextProviderProps {
  children: React.ReactChildren | React.ReactChild
}

const StoreContextProvider = (props: StoreContextProviderProps) => {
  const { data: user } = useUser();
  const mainDocRef = useFirestore()
    .collection('studylater').doc(user.uid);
  const { data: mainData } = useFirestoreDocData<MainDocModel>(mainDocRef);
  const [documentItems, setDocumentItems] = useState<DocumentRef[]>([]);

  useEffect(() => {
    if (mainData.documents) {
      console.log('Apply changes...');
      setDocumentItems(mainData.documents.map(item => {
        return {
          name: item.name,
          url: item.url,
          offline: false
        }
      }))
    }
  }, [mainData]);

  return (
    <StoreContext.Provider value={{
      documents: documentItems
    }}>
      {props.children}
    </StoreContext.Provider>
  )
}

export default StoreContextProvider;
