export const CompliantFactoryAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'nonCompliantERC20',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'violetId_',
        type: 'address',
      },
    ],
    name: 'deployCompliantErc',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'erc20ToCompliantWrapped',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]
