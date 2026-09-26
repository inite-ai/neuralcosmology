import { PREFS_KEY } from "./progress";

// Ставит тему и размер шрифта на .reader до первой отрисовки — без мигания.
export default function ReaderPrefsScript() {
  const js = `try{var p=JSON.parse(localStorage.getItem(${JSON.stringify(PREFS_KEY)})||"{}");var r=document.getElementById("reader");if(r){if(p.theme)r.dataset.theme=p.theme;if(p.size)r.dataset.size=p.size;}}catch(e){}`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
