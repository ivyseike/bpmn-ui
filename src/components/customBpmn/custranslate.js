import translations from './translations';


export default function customTranslate(template, replacements) {undefined
  replacements = replacements || {};

  // Translate
  template = translations[template] || template;

  // Replace
  return template.replace(/{([^}]+)}/g, function(_, key) {undefined
    return replacements[key] || '{' + key + '}';
  });
}