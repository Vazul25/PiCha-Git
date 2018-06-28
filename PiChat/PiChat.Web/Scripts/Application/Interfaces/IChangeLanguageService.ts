///<summary>
///Interface for the language controller service
///</summary>
interface IChangeLanguageService {
    changeLanguage: (key: string) => void;
}