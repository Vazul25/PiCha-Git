using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace PiChat.Bll.Managers
{
    /// <summary>
    /// Manages the localiztaion resources 
    /// </summary>
    public class ResourceManager
    {
        /// <summary>
        /// Gets a language resource corresponding to the lang parameter
        /// </summary>
        /// <param name="lang">Specifies which language resource we want to take</param>
        /// <returns>A dictionary for the translation</returns>
        // REVIEW: Ezt minden kérés betölti a ResourceManager-ből. Érdemes cache-elni, mert futás közben nem változhat.
        public static Dictionary<string, string> GetTranslationResource(string lang)
        {
            Dictionary<string, string> value;
            if (Cache.TryGetValue(lang, out value))
                return value;
            var resourceSet = Resources.Resources.ResourceManager.GetResourceSet(new System.Globalization.CultureInfo(lang), true, true);
            return Cache[lang] = resourceSet.Cast<DictionaryEntry>().ToDictionary(k => k.Key.ToString(), v => v.Value.ToString());
        }

        private static readonly Dictionary<string, Dictionary<string, string>> Cache = new Dictionary<string, Dictionary<string, string>>();
    }
}
