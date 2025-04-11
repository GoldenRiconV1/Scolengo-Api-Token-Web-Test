const form = document.getElementById('schoolForm')
const schoolsElem = document.querySelector('.schools')

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  form.hidden = true
  const query = document.getElementById('schoolName').value
  const response = await fetch(`https://github.com/GoldenRiconV1/Scolengo-Api-Token-Web-Test.git/api/schools?name=${encodeURIComponent(query)}`)
  const schools = await response.json()

  if (!schools.length) {
    alert("Établissement introuvable.")
    form.hidden = false
    return
  }

  schoolsElem.innerHTML = ''
  schools.forEach(school => {
    const schooHTML = `<b class="school-name">${school.name}</b>
      <span class="school-ems">(${school.emsCode})</span> -
      <i class="school-city">${school.city} ${school.zipCode}</i>
      <button class="school-select">Choisir</button>`

    const li = document.createElement('li')
    li.innerHTML = schooHTML
    li.querySelector('button').addEventListener('click', () => {
      const schoolStr = encodeURIComponent(JSON.stringify(school))
      location.href = `https://github.com/GoldenRiconV1/Scolengo-Api-Token-Web-Test.git/auth?school=${schoolStr}`
    })
    schoolsElem.appendChild(li)
  })
})
