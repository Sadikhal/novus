import { privacySections } from '../../lib/data';

const Privacy = () => {
  

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8 font-poppins text-center">
         Privacy Policy
      </h1>
      
      {privacySections.map((section, index) => (
        <section key={index} className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-4 font-poppins">
            {section.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-poppins text-justify whitespace-pre-wrap">
            {section.content.trim()}
          </p>
        </section>
      ))}

      <footer className="mt-12 pt-6 border-t border-slate-200">
        <p className="text-xs sm:text-sm text-slate-600 font-poppins text-center">
          For the complete and most up-to-date Privacy Policy, please refer to the official Novus website.
        </p>
      </footer>
    </div>
  );
};

export default Privacy;