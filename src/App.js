import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showSelectFriend, setShowSelectFriend] = useState(null);
  const [friends, setFriends] = useState(initialFriends);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }
  function handleSelectFriend(friend) {
    setShowSelectFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    console.log(value);
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === showSelectFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setShowSelectFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          showSelectFriend={showSelectFriend}
          onSplit={handleSelectFriend}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {showSelectFriend && (
        <FormSplitBill
          showSelectFriend={showSelectFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSplit, showSelectFriend }) {
  return (
    <ul>
      {friends.map((f) => (
        <Friend
          key={f.id}
          friend={f}
          showSelectFriend={showSelectFriend}
          onSplit={onSplit}
        ></Friend>
      ))}
    </ul>
  );
}

function Friend({ friend, onSplit, showSelectFriend }) {
  const isSelected = showSelectFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and your {friend.name} are even</p>}
      <Button onClick={() => onSplit(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();

    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🖼️Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ showSelectFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [payByUser, setPayByUser] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const FriendExp = bill ? bill - payByUser : "";

  function handleSummit(e) {
    e.preventDefault();
    if (!bill && !payByUser) return;
    onSplitBill(whoIsPaying === "user" ? FriendExp : -payByUser);
  }

  return (
    <form className="form-split-bill">
      <h2>Split with {showSelectFriend.name}</h2>
      <label>💰Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
      />
      <label>🫰Your expense</label>
      <input
        type="text"
        value={payByUser}
        onChange={(e) =>
          setPayByUser(
            Number(e.target.value) > bill ? payByUser : Number(e.target.value)
          )
        }
      />
      <label>👛 {showSelectFriend.name}'s expense</label>
      <input disabled type="text" value={FriendExp} />
      <label>Who's paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">you</option>
        <option value="friend">{showSelectFriend.name}</option>
      </select>
      <Button onClick={handleSummit}>Split list</Button>
    </form>
  );
}
