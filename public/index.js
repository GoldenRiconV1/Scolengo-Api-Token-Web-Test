// index.js pour le frontend web (navigateur)

const form = document.getElementById('schoolForm')
const schoolsElem = document.querySelector('.schools')
const schoolNameInput = document.getElementById('schoolName')

// Fonction pour effectuer une recherche d'école
const searchSchool = async (schoolName) => {
  try {
    const response = await fetch(`/api/schools?name=${encodeURIComponent(schoolName)}`)
    const schools = await response.json()
    
    if (schools.length === 0) {
      alert('Établissement introuvable. Essayez un autre nom ou code postal.')
      return
    }
    
    if (schools.length === 1) {
      // Si une seule école est trouvée, procéder à l'authentification
      schoolAuth(schools[0])
    } else {
      // Sinon, afficher la liste des écoles trouvées
      displaySchoolList(schools)
    }
  } catch (error) {
    console.error('Erreur lors de la recherche de l\'école:', error)
    alert('Une erreur est survenue lors de la recherche. Veuillez réessayer.')
  }
}

// Fonction pour afficher la liste des écoles
const displaySchoolList = (schools) => {
  schoolsElem.innerHTML = ''
  schools.forEach(school => {
    const schoolHTML = `
      <b class="school-name" title="${school.id}">${school.name}</b>
      <span class="school-ems">(${school.emsCode})</span> -
      <i class="school-city">${school.city.replace('CEDEX', '').trim()} ${school.zipCode}</i>
      <button class="school-select">Choisir</button>
    `
    const li = document.createElement('li')
    li.innerHTML = schoolHTML
    li.querySelector('button').addEventListener('click', () => schoolAuth(school))
    schoolsElem.appendChild(li)
  })
}

// Fonction pour initier l'authentification avec l'école sélectionnée
const schoolAuth = async (school) => {
  try {
    const response = await fetch(`/auth?id=${school.id}&school=${encodeURIComponent(JSON.stringify(school))}`)
    if (response.ok) {
      const authUrl = await response.text()  // L'URL d'authentification redirigera l'utilisateur
      window.location.href = authUrl // Redirige l'utilisateur vers l'URL d'authentification
    } else {
      alert('Impossible de démarrer l\'authentification. Veuillez réessayer.')
    }
  } catch (error) {
    console.error('Erreur lors de l\'authentification:', error)
    alert('Une erreur est survenue lors de l\'authentification. Veuillez réessayer.')
  }
}

// Gestion du formulaire de recherche d'école
form.addEventListener('submit', (e) => {
  e.preventDefault()
  const schoolName = schoolNameInput.value.trim()
  if (schoolName) {
    searchSchool(schoolName)
  }
})

