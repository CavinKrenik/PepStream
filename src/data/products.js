export const PRODUCTS = [
  {
    id: 'retatrutide10',
    title: 'Retatrutide 10mg',
    price: 95.0,
    img: '/assets/Retatrutide.JPG',
    coa: '/assets/RetatrutideCertofAnalysis.jpg',
    badge: 'Eligible for Free Shipping',
    details:
      'Retatrutide (LY3437943) is a research peptide reference material used in laboratory studies exploring incretin-related and glucagon receptor signaling pathways, energy balance, and metabolic regulation under controlled experimental conditions.',
    disclaimer:
      'For laboratory research use only. Not for human consumption or use in medical, veterinary, or household applications. All sales are subject to our Terms & Conditions of Sale.',
    researchInfo: {
      classification: 'Tri-agonist peptide',
      summary:
        'Retatrutide (LY3437943) is a synthetic multi-agonist peptide studied for its interaction with GLP-1, GIP, and glucagon receptors. Research focuses on metabolic pathway modulation, receptor cross-talk, and energy balance mechanisms.',
      areas: [
        'Receptor binding',
        'Metabolic signaling research',
        'Peptide stability studies',
      ],
      specs: {
        form: 'Lyophilized powder',
        purity: '≥98%',
        appearance: 'White powder',
        mw: 'See COA',
      },
    },
  },
  {
    id: 'bacwater',
    title: 'Bacteriostatic Water 10ml',
    price: 15.0,
    img: '/assets/bacwater.jpg',
    coa: null,
    badge: 'In Stock',
    details:
      'Bacteriostatic Water (0.9% benzyl alcohol) is a sterile, non-pyrogenic laboratory reagent commonly used to dilute or reconstitute research-use materials for in vitro and other non-clinical experimental procedures.',
    disclaimer:
      'For laboratory research use only. Not for human consumption or use in medical, veterinary, or household applications. All sales are subject to our Terms & Conditions of Sale.',
    researchInfo: {
      classification: 'Laboratory Reagent / Solvent',
      summary:
        'Bacteriostatic water is sterile water containing 0.9% benzyl alcohol, used as a bacteriostatic preservative. It is the standard solvent for reconstituting lyophilized peptides for laboratory handling and stability testing.',
      areas: [
        'Peptide reconstitution',
        'In vitro dilution',
        'Laboratory reagent preparation',
      ],
      specs: {
        form: 'Liquid',
        purity: 'Sterile, Non-pyrogenic',
        appearance: 'Clear liquid',
        mw: '18.015 g/mol',
      },
    },
  },

  {
    id: 'retatrutide20',
    title: 'Retatrutide 20mg',
    price: 150.0,
    img: '/assets/reta20.png',
    coa: '/assets/RetatrutideCertofAnalysis.jpg',
    badge: 'Eligible for Free Shipping',
    details:
      'Retatrutide 20mg is a higher-quantity research peptide reference material for use in laboratory investigations of incretin-related and glucagon receptor signaling, metabolic pathways, and energy homeostasis.',
    disclaimer:
      'For laboratory research use only. Not for human consumption or use in medical, veterinary, or household applications. All sales are subject to our Terms & Conditions of Sale.',
    researchInfo: {
      classification: 'Tri-agonist peptide',
      summary:
        'Retatrutide (LY3437943) is a synthetic multi-agonist peptide studied for its interaction with GLP-1, GIP, and glucagon receptors. Research focuses on metabolic pathway modulation, receptor cross-talk, and energy balance mechanisms.',
      areas: [
        'Receptor binding',
        'Metabolic signaling research',
        'Peptide stability studies',
      ],
      specs: {
        form: 'Lyophilized powder',
        purity: '≥98%',
        appearance: 'White powder',
        mw: 'See COA',
      },
    },
  },
  {
    id: 'tesamorelin',
    title: 'Tesamorelin 10mg',
    price: 75.0,
    img: '/assets/tesa.jpg',
    coa: null,
    badge: 'Eligible for Free Shipping',
    details:
      'Tesamorelin is a synthetic peptide analogue of growth hormone–releasing hormone (GHRH) supplied as a reference material for laboratory studies involving endocrine signaling, growth hormone pathways, and related metabolic research models.',
    disclaimer:
      'For laboratory research use only. Not for human consumption or use in medical, veterinary, or household applications. All sales are subject to our Terms & Conditions of Sale.',
    researchInfo: {
      classification: 'GHRH analog',
      summary:
        'Tesamorelin is used in research involving growth hormone–releasing pathways, receptor selectivity, and peptide pharmacodynamics. It is a stabilized analogue of GHRH.',
      areas: [
        'Endocrine signaling studies',
        'Peptide receptor analysis',
        'In vitro pharmacokinetics',
      ],
      specs: {
        form: 'Lyophilized peptide',
        purity: '≥98%',
        appearance: 'White powder',
        mw: 'See COA',
      },
    },
  },
  {
    id: 'ghkcu',
    title: 'GHK-Cu 50mg',
    price: 40.0,
    img: '/assets/GHK-CU.jpg',
    coa: '/assets/GHK-CUCertofAnalysis.jpg',
    badge: 'Eligible for Free Shipping',
    details:
      'GHK-Cu (glycyl-histidyl-lysine copper complex) is a copper-binding peptide reference material commonly used in laboratory research on extracellular matrix biology, cutaneous and cellular signaling, and related biochemical pathways.',
    disclaimer:
      'For laboratory research use only. Not for human consumption or use in medical, veterinary, or household applications. All sales are subject to our Terms & Conditions of Sale.',
    researchInfo: {
      classification: 'Copper-binding peptide',
      summary:
        'GHK-Cu is a naturally occurring copper complex of the tripeptide glycyl-L-histidyl-L-lysine. It is studied for its role in collagen synthesis, tissue remodeling pathways, and antioxidant enzyme regulation.',
      areas: [
        'Extracellular matrix research',
        'Cellular signaling',
        'Tissue remodeling models',
      ],
      specs: {
        form: 'Lyophilized powder (Blue)',
        purity: '≥98%',
        appearance: 'Blue powder',
        mw: '~405 g/mol',
      },
    },
  },

  /* --- UNAVAILABLE ITEM --- */
  {
    id: 'nad',
    title: 'NAD+ 500 mg',
    price: 60.0,
    unavailable: true,
    img: '/assets/placeholder.png',
    coa: null,
    badge: 'In Stock',
    details:
      'Nicotinamide adenine dinucleotide (NAD+) is a pyridine nucleotide supplied as a reference standard for laboratory investigations of cellular metabolism, redox reactions, mitochondrial function, and related biochemical pathways.',
    disclaimer:
      'For laboratory research use only. Not for human consumption or use in medical, veterinary, or household applications. All sales are subject to our Terms & Conditions of Sale.',
    researchInfo: {
      classification: 'Coenzyme / Nucleotide',
      summary:
        'NAD+ is a central coenzyme found in all living cells. It is essential for redox reactions, serving as an electron carrier, and is a substrate for enzymes like sirtuins and PARPs involved in DNA repair and gene expression.',
      areas: [
        'Mitochondrial function',
        'Redox biochemistry',
        'Enzymatic kinetics',
      ],
      specs: {
        form: 'Lyophilized powder',
        purity: '≥98%',
        appearance: 'White powder',
        mw: '663.43 g/mol',
      },
    },
  },

  {
    id: 'bpc_tb',
    title: 'BPC/TB Blend 10mg',
    price: 45.0,
    img: '/assets/bpctb.jpg',
    coa: null,
    badge: 'Eligible for Free Shipping',
    details:
      'This BPC-157 and TB-500 blend is provided as a peptide reference material for laboratory research examining connective tissue–related signaling, cytoskeletal dynamics, and inflammatory pathway models under controlled experimental conditions.',
    disclaimer:
      'For laboratory research use only. Not for human consumption or use in medical, veterinary, or household applications. All sales are subject to our Terms & Conditions of Sale.',
    researchInfo: {
      classification: 'Peptide Blend (Protein fragment / Synthetic)',
      summary:
        'A research blend of BPC-157 (Body Protection Compound) and TB-500 (Thymosin Beta-4 fragment). BPC-157 is investigated for cytoprotection and angiogenesis, while TB-500 is studied for its role in actin sequestration and cytoskeletal structure.',
      areas: [
        'Cell-signaling research',
        'Angiogenesis pathways',
        'Cytoskeletal dynamics',
      ],
      specs: {
        form: 'Lyophilized powder',
        purity: '≥98% (each component)',
        appearance: 'White powder',
        mw: 'See COA',
      },
    },
  },
  {
    id: 'mt2',
    title: 'Melanotan 2 (MT2) 10mg',
    price: 45.0,
    img: '/assets/mt2.jpg',
    coa: null,
    badge: 'Eligible for Free Shipping',
    details:
      'Melanotan II is a peptide analog of alpha-melanocyte-stimulating hormone (α-MSH), supplied for laboratory studies of melanocortin receptor signaling, pigmentation-related pathways, and associated biochemical mechanisms.',
    disclaimer:
      'For laboratory research use only. Not for human consumption or use in medical, veterinary, or household applications. All sales are subject to our Terms & Conditions of Sale.',
    researchInfo: {
      classification: 'Melanocortin analog',
      summary:
        'Melanotan II is a synthetic analogue of the peptide hormone alpha-melanocyte-stimulating hormone (α-MSH). It is a non-selective agonist of the melanocortin receptors (MC1R, MC3R, MC4R, MC5R).',
      areas: [
        'Melanocortin receptor signaling',
        'Pigmentation pathways',
        'Neurological receptor studies',
      ],
      specs: {
        form: 'Lyophilized powder',
        purity: '≥98%',
        appearance: 'White powder',
        mw: '1024.18 g/mol',
      },
    },
  },

  /* --- IMPORT STOCK 10–15 DAY WAIT --- */
  {
    id: 'pt141',
    title: 'PT-141 10mg',
    price: 120.0,
    img: '/assets/placeholder.png',
    coa: null,
    badge: 'Out of Stock',
    details:
      'PT-141 (bremelanotide) is a melanocortin receptor agonist provided as a research peptide for laboratory work involving central nervous system melanocortin signaling and related receptor pathway studies.',
    disclaimer:
      'For laboratory research use only. Not for human consumption or use in medical, veterinary, or household applications. All sales are subject to our Terms & Conditions of Sale.',
    researchInfo: {
      classification: 'Melanocortin receptor agonist',
      summary:
        'PT-141 (Bremelanotide) is a metabolite of Melanotan II that lacks the C-terminal amide function. It is studied for its specific affinity for melanocortin receptors MC3R and MC4R in the central nervous system.',
      areas: [
        'CNS receptor signaling',
        'Melanocortin pathway analysis',
        'Neurological modeling',
      ],
      specs: {
        form: 'Lyophilized powder',
        purity: '≥98%',
        appearance: 'White powder',
        mw: '1025.2 g/mol',
      },
    },
  },
  {
    id: 'ipacjc',
    title: 'IPA-CJC Blend 5mg/5mg',
    price: 85.0,
    img: '/assets/ipa.jpg',
    coa: null,
    badge: '10–15 Day Wait',
    details:
      'This Ipamorelin and CJC-1295 blend is supplied as a peptide reference material for laboratory investigations into growth hormone–related signaling, pituitary axis pathways, and metabolic research models.',
    disclaimer:
      'For laboratory research use only. Not for human consumption or use in medical, veterinary, or household applications. All sales are subject to our Terms & Conditions of Sale.',
    researchInfo: {
      classification: 'GHRH / GHRP Blend',
      summary:
        'A blend of CJC-1295 (GHRH analog) and Ipamorelin (Growth Hormone Secretagogue). CJC-1295 is used to study GHRH receptor pathways, while Ipamorelin is investigated for its selective binding to the ghrelin/GHS receptor.',
      areas: [
        'Pituitary axis signaling',
        'GHS receptor binding',
        'Synergistic pathway modeling',
      ],
      specs: {
        form: 'Lyophilized powder',
        purity: '≥98% (each component)',
        appearance: 'White powder',
        mw: 'See COA',
      },
    },
  },

  /* --- HIGH DEMAND --- */
  {
    id: 'glowstack',
    title: 'Glow Stack 70mg',
    price: 75.0,
    img: '/assets/glowstack.jpg',
    coa: null,
    badge: 'US Stock — Limited Supply',
    details:
      'Glow Stack 70mg is a multi-component peptide blend formulated as a laboratory reference material for research on selected cutaneous and cellular signaling pathways under controlled experimental conditions.',
    disclaimer:
      'For laboratory research use only. Not for human consumption or use in medical, veterinary, or household applications. All sales are subject to our Terms & Conditions of Sale.',
    researchInfo: {
      classification: 'Multi-peptide Research Blend',
      summary:
        'A complex blend of peptides including GHK-Cu, BPC-157, and TB-500. Designed for comprehensive in vitro studies of extracellular matrix maintenance, angiogenesis, and cellular repair signaling.',
      areas: [
        'Complex signaling pathways',
        'Synergistic peptide effects',
        'Tissue engineering models',
      ],
      specs: {
        form: 'Lyophilized powder',
        purity: '≥98% (each component)',
        appearance: 'Blue/White powder',
        mw: 'Various',
      },
    },
  },

  /* --- NEW PRODUCTS --- */
  {
    id: 'ghrp6',
    title: 'GHRP-6 10mg',
    price: 60.0,
    img: '/assets/placeholder.png',
    coa: null,
    badge: 'In Stock',
    details:
      'GHRP-6 is a synthetic hexapeptide that acts as a growth hormone secretagogue. It is supplied as a reference material for laboratory studies involving ghrelin receptor signaling and pituitary function.',
    disclaimer:
      'For laboratory research use only. Not for human consumption or use in medical, veterinary, or household applications. All sales are subject to our Terms & Conditions of Sale.',
    researchInfo: {
      classification: 'Growth Hormone Secretagogue',
      summary:
        'GHRP-6 is a synthetic hexapeptide that stimulates the release of growth hormone via the ghrelin/growth hormone secretagogue receptor (GHS-R). It is widely used in research to study pituitary function and appetite regulation pathways.',
      areas: [
        'GH secretion models',
        'Ghrelin receptor signaling',
        'Appetite regulation research',
      ],
      specs: {
        form: 'Lyophilized powder',
        purity: '≥98%',
        appearance: 'White powder',
        mw: '873.01 g/mol',
      },
    },
  },
  {
    id: 'motsc',
    title: 'MOTS-c 10mg',
    price: 75.0,
    img: '/assets/placeholder.png',
    coa: null,
    badge: 'In Stock',
    details:
      'MOTS-c is a mitochondrial-derived peptide encoded by the 12S rRNA region of the mitochondrial genome. It is provided for research into metabolic homeostasis and cellular energy signaling.',
    disclaimer:
      'For laboratory research use only. Not for human consumption or use in medical, veterinary, or household applications. All sales are subject to our Terms & Conditions of Sale.',
    researchInfo: {
      classification: 'Mitochondrial-derived peptide',
      summary:
        'MOTS-c (Mitochondrial Open Reading Frame of the 12S rRNA-c) is a peptide encoded by the mitochondrial genome. Research suggests it plays a role in regulating metabolic homeostasis and insulin sensitivity via AMPK activation.',
      areas: [
        'Mitochondrial function',
        'Metabolic regulation',
        'AMPK signaling pathways',
      ],
      specs: {
        form: 'Lyophilized powder',
        purity: '≥98%',
        appearance: 'White powder',
        mw: '2174.6 g/mol',
      },
    },
  },
  {
    id: 'dsip',
    title: 'DSIP 5mg',
    price: 80.0,
    img: '/assets/placeholder.png',
    coa: null,
    badge: 'In Stock',
    details:
      'Delta Sleep-Inducing Peptide (DSIP) is a neuropeptide with potential neuromodulatory properties. It is supplied for laboratory investigations into sleep architecture, stress responses, and neuroendocrine regulation.',
    disclaimer:
      'For laboratory research use only. Not for human consumption or use in medical, veterinary, or household applications. All sales are subject to our Terms & Conditions of Sale.',
    researchInfo: {
      classification: 'Neuropeptide',
      summary:
        'DSIP (Delta Sleep-Inducing Peptide) is a naturally occurring nonapeptide. It is studied for its potential role in sleep regulation, stress response modulation, and antioxidant activity in neuronal models.',
      areas: [
        'Neuromodulation',
        'Sleep architecture studies',
        'Stress response models',
      ],
      specs: {
        form: 'Lyophilized powder',
        purity: '≥98%',
        appearance: 'White powder',
        mw: '848.81 g/mol',
      },
    },
  },
]
