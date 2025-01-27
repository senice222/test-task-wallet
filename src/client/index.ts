import inquirer from 'inquirer';
import axios from 'axios';
import { config } from '../config';
import { WalletDto } from 'types/WalletDto';
    
const API_URL = 'http://localhost:3000/api';

interface AmountPrompt {
  amount: number;
}

async function main() {
  if (!config.userId) {
    console.log('Необходимо создать пользователя');
    await createUser();
    if (!config.userId) {
      console.log('Не удалось создать пользователя');
      return;
    }
  }

  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Выберите действие:',
        choices: [
          { name: 'Создать пользователя', value: 'create_user' },
          { name: 'Создать кошелек', value: 'create' },
          { name: 'Перевод средств', value: 'transfer' },
          { name: 'Выход', value: 'exit' }
        ]
      }
    ]);

    if (action === 'exit') break;

    if (action === 'create_user') {
      await createUser();
    } else if (action === 'create') {
      await createWallet();
    } else if (action === 'transfer') {
      await transferFunds();
    }
  }
}

async function createWallet() {
  try {
    const {data} = await axios.post(`${API_URL}/wallets`, {userId: config.userId});
    console.log('Создан новый кошелек:', data.address);
  } catch (error: any) {
    console.error('Ошибка при создании кошелька:', error.message);
  }
}

async function transferFunds() {
  try {
    const {data: userWallets} = await axios.get(`${API_URL}/wallets`);

    if (userWallets.length === 0) {
      console.log('У вас нет доступных кошельков');
      return;
    }

    const { fromWallet } = await inquirer.prompt([
      {
        type: 'list',
        name: 'fromWallet',
        message: 'Выберите кошелек для отправки:',
        choices: userWallets.map((w: WalletDto) => ({
          name: `Кошелек ${w.address.slice(0, 8)}... (Баланс: ${w.balance})`,
          value: w.address
        }))
      }
    ]);

    const selectedWallet = userWallets.find((w: WalletDto) => w.address === fromWallet);

    const { toAddress } = await inquirer.prompt([
      {
        type: 'list',
        name: 'toAddress',
        message: 'Выберите кошелек получателя:',
        choices: [
          ...userWallets
            .filter((w: WalletDto) => w.address !== fromWallet)
            .map((w: WalletDto) => ({
              name: `Кошелек ${w.address.slice(0, 8)}... (Баланс: ${w.balance})`,
              value: w.address
            })),
          new inquirer.Separator(),
          { name: 'Ввести адрес вручную', value: 'manual' }
        ]
      }
    ]);

    let targetAddress = toAddress;
    if (toAddress === 'manual') {
      const { manualAddress } = await inquirer.prompt([
        {
          type: 'input',
          name: 'manualAddress',
          message: 'Введите адрес кошелька получателя:',
          validate: (input: string) => {
            if (input === fromWallet) return 'Нельзя отправить самому себе';
            if (!input) return 'Адрес не может быть пустым';
            return true;
          }
        }
      ]);
      targetAddress = manualAddress;
    }

    const { amount } = await inquirer.prompt<AmountPrompt>({
      type: 'number',
      name: 'amount',
      message: `Введите сумму перевода (доступно: ${selectedWallet.balance}):`,
      validate: (input: number | undefined): boolean | string => {
        if (!input) return 'Сумма не может быть пустой';
        if (input <= 0) return 'Сумма должна быть больше 0';
        if (input > selectedWallet.balance) return 'Недостаточно средств';
        return true;
      }
    });

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Подтвердите перевод ${amount} на кошелек ${targetAddress.slice(0, 8)}...`,
        default: false
      }
    ]);

    if (!confirm) {
      console.log('Транзакция отменена');
      return;
    }

    const {data} = await axios.post(`${API_URL}/transactions`, {
      fromWallet,
      toWallet: targetAddress,
      amount,
      userId: config.userId
    });

    console.log('Транзакция успешно создана!');
    console.log(`Отправлено: ${amount}`);
    console.log(`С кошелька: ${fromWallet}`);
    console.log(`На кошелек: ${targetAddress}`);
    console.log(`Статус: ${data.status}`);
  } catch (error: any) {
    console.error('Ошибка при переводе средств:', error.message);
  }
}

async function createUser() {
  try {
    const { username } = await inquirer.prompt([
      {
        type: 'input',
        name: 'username',
        message: 'Введите имя пользователя:',
        validate: (input: string) => {
          if (!input) return 'Имя пользователя не может быть пустым';
          return true;
        }
      }
    ]);

    const {data} = await axios.post(`${API_URL}/users`, { username });
    console.log('Пользователь создан:', data);
    
    config.setUserId(data._id);
    console.log('ID пользователя установлен:', config.userId);
    
    return data._id;
  } catch (error: any) {
    console.error('Ошибка при создании пользователя:', error.message);
    return null;
  }
}

main().catch(console.error); 