const themes = [
  {
    id: 'hawk',
    name: 'Hawk',
    multiplier: 1,
    cost: 0,
    data: '0.01MB',
    colors: {
      buttonText: '#6bb1ff',
      experienceBar: {
        active: {
          background1: '#4facfe',
          background2: '#00f2fe',
          boxShadow: '#2379f9'
        },
        empty: {
          background1: [79, 172, 254],
          background2: [0, 242, 254],
          boxShadow: '#2379f9'
        }
      },
      // 3D
      shipBase: '#FFFFFF',
      wing: '#FFFFFF',
      wingAccent: '#FFFFFF',
      emission: '#AEE0FF',
      fog: '#A3C5E7',
      wave: '#4495E7',
      directionalLight: '#A3C5E7',
      accentEmission: '#FF3E3E'
    }
  },
  // {
  //   id: 'lotus',
  //   name: 'Lotus',
  //   multiplier: 5,
  //   cost: 0.05,
  //   data: '0.05MB'
  // },
  // {
  //   id: 'phoenix',
  //   name: 'Phoenix',
  //   multiplier: 10,
  //   cost: 0.1,
  //   data: '0.1MB'
  // },
  {
    id: 'ghost',
    name: 'Ghost',
    multiplier: 25,
    cost: 0.25,
    data: '0.25MB',
    colors: {
      buttonText: '#6bffa6',
      experienceBar: {
        active: {
          background1: '#3cd309',
          background2: '#88c839',
          boxShadow: '#3cd309'
        },
        empty: {
          background1: [236, 254, 79],
          background2: [254, 186, 0],
          boxShadow: '#3cd309'
        }
      },
      // 3D
      shipBase: '#000000',
      wing: '#000000',
      wingAccent: '#000000',
      emission: '#8EE339',
      fog: '#A3E7BF',
      wave: '#44E780',
      directionalLight: '#A3E7BF',
      accentEmission: '#FF3E3E'
    }
  }
];

export default themes;
