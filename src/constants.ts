import { DataStore } from './types';

export const INITIAL_DATA: DataStore = {
  years: [
    {
      id: 'y1',
      name: '1ère Année Médecine',
      semesters: [
        {
          id: 's1',
          name: 'Semestre 1',
          modules: [
            {
              id: 'anat1',
              name: 'Anatomie I',
              description: 'Ostéologie et Arthrologie du membre supérieur.',
              pdfs: [
                { id: 'p1', name: 'Cours Introduction Anatomie.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
                { id: 'p2', name: 'Ostéologie Membre Sup.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
              ],
              questions: [
                {
                  id: 'q1',
                  text: 'Quel os appartient à l\'avant-bras ?',
                  options: ['Humérus', 'Fémur', 'Ulna', 'Tibia'],
                  correctIndex: 2, // 0 = Humérus, 1 = Fémur, 2 = Ulna (Correct), 3 = Tibia
                  explanation: 'L\'avant-bras est constitué de deux os : le radius (latéral) et l\'ulna (médial).'
                },
                {
                  id: 'q2',
                  text: 'Combien de vertèbres cervicales possède l\'homme ?',
                  options: ['5', '7', '12', '4'],
                  correctIndex: 1,
                  explanation: 'La colonne cervicale est composée de 7 vertèbres (C1 à C7).'
                },
                {
                  id: 'q3',
                  text: 'Quelle est la tubercule qui se trouve dans l epiphyse distal de radius ',
                  options: ['tubercule de lister', 'trochanter', 'trochiter', 'tubercule majeure de l\'humerus'],
                  correctIndex: 0,
                  explanation: 'Le tubercule de Lister est palpable sur la face postérieure de l\'épiphyse distale du radius.'
                }
              ]
            },
            {
              id: 'histo1',
              name: 'Histologie',
              description: 'Étude des tissus biologiques.',
              pdfs: [],
              questions: [
                {
                  id: 'hq1',
                  text: 'Quel type d\'épithélium tapisse la lumière des vaisseaux sanguins ?',
                  options: [
                    'Épithélium pavimenteux simple (Endothélium)',
                    'Épithélium cubique simple',
                    'Épithélium prismatique simple',
                    'Épithélium transitionnel'
                  ],
                  correctIndex: 0,
                  explanation: 'L\'endothélium est un épithélium pavimenteux simple qui facilite les échanges et le flux sanguin.'
                }
              ]
            },
            {
              id: 'bio1',
              name: 'Biologie Cellulaire',
              description: 'Structure et fonction de la cellule.',
              pdfs: [],
              questions: []
            }
          ]
        },
        {
          id: 's2',
          name: 'Semestre 2',
          modules: []
        }
      ]
    },
    {
      id: 'y2',
      name: '2ème Année Médecine',
      semesters: [
        {
          id: 's3',
          name: 'Semestre 3',
          modules: []
        }
      ]
    }
  ]
};