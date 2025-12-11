import { DataStore } from './types';

export const INITIAL_DATA: DataStore = {
  years: [
    // ============================================================
    // 1ÈRE ANNÉE
    // ============================================================
    {
      id: 'annee-1',
      name: '1ère Année Médecine',
      semesters: [
        // --- SEMESTRE 1 ---
        {
          id: 's1',
          name: 'Semestre 1',
          modules: [
            {
              id: 'mod-anat-1',
              name: 'Anatomie I',
              description: 'Ostéologie du membre supérieur et inférieur',
              // LISTE DES PDFS DU MODULE
              pdfs: [
                { id: 'pdf1', name: 'Cours Ostéologie.pdf', url: '#' },
                { id: 'pdf2', name: 'Cours Arthrologie.pdf', url: '#' }
              ],
              // LISTE DES QUESTIONS QCM DU MODULE
              questions: [
                {
                  id: 'q1',
                  text: 'Quel est l\'os le plus long du corps humain ?',
                  options: ['Humérus', 'Fémur', 'Tibia', 'Fibula'],
                  correctIndex: 1, // 0 = A, 1 = B, 2 = C, 3 = D
                  explanation: 'Le fémur est l\'os de la cuisse et c\'est le plus long du corps.'
                },
                {
                  id: 'q2',
                  text: 'Combien de vertèbres lombaires possède l\'homme ?',
                  options: ['7', '12', '5', '3'],
                  correctIndex: 2,
                  explanation: 'Il y a 5 vertèbres lombaires (L1 à L5).'
                }
              ]
            },
            {
              id: 'mod-cyto-1',
              name: 'Cytologie',
              description: 'Biologie cellulaire',
              pdfs: [],
              questions: [] // Ajoutez vos questions ici entre les crochets
            }
          ]
        },
        // --- SEMESTRE 2 ---
        {
          id: 's2',
          name: 'Semestre 2',
          modules: [
            {
              id: 'mod-phy-1',
              name: 'Physiologie',
              description: '',
              pdfs: [],
              questions: []
            }
          ]
        }
      ]
    },

    // ============================================================
    // 2ÈME ANNÉE
    // ============================================================
    {
      id: 'annee-2',
      name: '2ème Année Médecine',
      semesters: [
        {
          id: 's3',
          name: 'Semestre 3',
          modules: [
             // Copiez-collez un bloc "module" ci-dessous pour en ajouter un
             {
               id: 'mod-s3-1',
               name: 'Module S3 Exemple',
               description: 'Description...',
               pdfs: [],
               questions: []
             }
          ]
        },
        {
          id: 's4',
          name: 'Semestre 4',
          modules: []
        }
      ]
    },

    // ============================================================
    // 3ÈME ANNÉE
    // ============================================================
    {
      id: 'annee-3',
      name: '3ème Année Médecine',
      semesters: [
        { id: 's5', name: 'Semestre 5', modules: [] },
        { id: 's6', name: 'Semestre 6', modules: [] }
      ]
    },
    
    // ============================================================
    // 4ÈME ANNÉE
    // ============================================================
    {
        id: 'annee-4',
        name: '4ème Année Médecine',
        semesters: [
          { id: 's7', name: 'Semestre 7', modules: [] },
          { id: 's8', name: 'Semestre 8', modules: [] }
        ]
    }
  ]
};