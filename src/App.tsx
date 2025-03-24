import { useTranslation } from 'react-i18next';

const App = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex h-screen w-screen justify-center items-center"> { /* DON'T REMOVE */}
      <div className="flex flex-col items-center space-y-4">
        <div>
          <p className='text-5xl'>Boilerplate React</p>
        </div> 
 
        <h1>{t('welcome')}</h1>
        <div className="flex gap-2 mt-2">
          <button onClick={() => changeLanguage('fr')} className="px-2 py-1 bg-white text-blue-500 rounded">
            Français
          </button>
          <button onClick={() => changeLanguage('en')} className="px-2 py-1 bg-white text-blue-500 rounded">
            English
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
