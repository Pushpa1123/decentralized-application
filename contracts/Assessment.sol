// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    string public password;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event PasswordChanged(string newPassword);
    event AlphabetUsed(string alphabet);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
        password = "ghjk"; // Set default password
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }

    function changePassword(string memory _newPassword) public {
        require(msg.sender == owner, "You are not the owner of this account");
        password = _newPassword;
        emit PasswordChanged(_newPassword);
    }

    function printAlphabets() public {
        string memory alphabets = "abcdefghijklmnopqrstuvwxyz";
        for (uint256 i = 0; i < bytes(alphabets).length; i++) {
            emit AlphabetUsed(substr(alphabets, i, 1));
        }
    }

    function substr(string memory str, uint256 startIndex, uint256 length) internal pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        require(startIndex < strBytes.length, "Start index out of range");
        uint256 endIndex = startIndex + length > strBytes.length ? strBytes.length : startIndex + length;
        bytes memory result = new bytes(endIndex - startIndex);
        for (uint256 i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = strBytes[i];
        }
        return string(result);
    }
}
