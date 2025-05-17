const fs = require('fs');
const fetch = require('node-fetch');

const username = 'your-github-username';
const readmePath = './README.md';

async function getGists() {
  const res = await fetch(`https://api.github.com/users/${username}/gists`);
  if (!res.ok) throw new Error('Failed to fetch gists');
  const gists = await res.json();
  return gists.slice(0, 5); // latest 5 gists
}

function generateGistsMarkdown(gists) {
  return gists
    .map(gist => {
      const description = gist.description || 'No description';
      return `- [${description}](${gist.html_url})`;
    })
    .join('\n');
}

async function updateReadme() {
  const gists = await getGists();
  const markdown = generateGistsMarkdown(gists);

  let readme = fs.readFileSync(readmePath, 'utf8');
  const regex = /(<!-- START_gists -->)([\s\S]*)(<!-- END_gists -->)/;
  const newReadme = readme.replace(regex, `$1\n${markdown}\n$3`);

  fs.writeFileSync(readmePath, newReadme);
  console.log('README.md updated with latest gists');
}

updateReadme().catch(err => {
  console.error(err);
  process.exit(1);
});
